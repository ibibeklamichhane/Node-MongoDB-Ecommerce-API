import { generateToken } from "../config/jwtToken.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import User from "../models/userModel.js"
import asyncHandler from "express-async-handler"
import { validationResult } from "express-validator";
import httpStatus from 'http-status';

export const createUser = async (req, res) => {
    try {
        // checcking validation error
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(422).json({
                message: "Validation Failed",
                error: error.array(),
                success: false
            });
        }
        const email = req.body.email;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
                success: false,
            });
        }
        // Create a new user
        const newUser = await User.create(req.body);
        return res.status(201).json({
            message: "User created successfully",
            success: true,
            user: newUser,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

// module.exports= { createUser };



/*
// update user
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Check if the new email is already taken
        if (req.body.email && req.body.email !== userToUpdate.email) {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({
                    message: "Email already in use by another user",
                    success: false,
                });
            }
        }

        // Update user fields
        userToUpdate.firstname = req.body.firstname || userToUpdate.firstname;
        userToUpdate.lastname = req.body.lastname || userToUpdate.lastname;
        userToUpdate.email = req.body.email || userToUpdate.email;
        userToUpdate.mobile = req.body.mobile || userToUpdate.mobile;

        await userToUpdate.save();

        return res.status(200).json({
            message: "User updated successfully",
            success: true,
            user: userToUpdate,
        });
    } catch (error) {
        console.error("Error updating user", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});
*/

//when sending the payload only send the fields that are requred to be updated
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Check if email needs to be updated and ensure it's unique
        if (req.body.email && req.body.email !== userToUpdate.email) {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({
                    message: "Email already in use by another user",
                    success: false,
                });
            }
        }

        // Update only the provided fields
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined) {
                userToUpdate[key] = req.body[key];
            }
        });

        await userToUpdate.save();

        return res.status(200).json({
            message: "User updated successfully",
            success: true,
            user: userToUpdate,
        });
    } catch (error) {
        console.error("Error updating user", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});


// login user
export const userLogin = asyncHandler(async (req, res) => {
    const{email, password} = req.body;
    // findUser variable include all the information of that user with that email.
    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)){
        // for refreshing token we will be sending the user id
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateuser = await User.findByIdAndUpdate(findUser.id, 
        {
            refreshToken: refreshToken,
        }, {
            new:true
        });
        // ava store garam  token lai cookie ma
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        // res.json(findUser);
        res.json({
            // ?. syntax is called optional chaining introduced on ecma script in 2020
            _id :findUser?._id,
            firstname : findUser?.firstname,
            lastname : findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    }else{
        throw new Error("Invalid Credentials");
    }
}); 



export const handleRefreshToken = asyncHandler(async (req, res)=> {
    const cookie = req.cookies;
    if(!cookie.refreshToken){
        throw new Error("Refresh token not found");
    };
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({refreshToken: refreshToken});
    if(!user){
        throw new Error("User not found from a cookie");
    }
    Jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode)=> {
        if(err || user.id !==decode.id){
            throw new Error('There is something wrong with refresh token');
        }
        const accessToken = generateToken(user?._id)
        res.json(accessToken);
    });
});


// logout functionality

export const logout = asyncHandler(async (req, res) => {
    const { token } = req.cookies;
  
    if (!token) {
      return res.status(204).json({ message: "No refresh token found" });
    }
  
    // Find the user with the refresh token
    const user = await User.findOne({ token });
  
    if (!user) {
      // If no user found, clear the cookie anyway
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(204).json({ message: "Logged out successfully" });
    }
  
    // Clear the refresh token in the database
    await User.findByIdAndUpdate(user._id, { token: "" });
  
    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",

    });
  
    return res.status(200).json({ message: "Logged out successfully" });
  });



// CRUD Operations

// Get all users
export const getallUser = asyncHandler(async(req,res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
});


//Single users line aava

export const getSingleUser = asyncHandler(async(req,res)=> {
    const {id} = req.params;
    try{
        const singleUser = await User.findById(id);
        if (!singleUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(singleUser);
    }catch(error){
        throw new Error(error);
    }
});



// delete user

export const deleteSingleUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    try{
        const deleteSingleUser = await User.findByIdAndDelete(id);
        res.json({
            'message': 'User has deleted successfully',
        });
    }catch(error){
        throw new Error(error);
    }
});

