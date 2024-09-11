import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        // unique:true,
        index:true,
    },
    lastname:{
        type:String,
        required:true,
        // unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        // unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin: {
        type:String,
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt:Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},

{
    timestamps:true,
}


);

// this code to encrypt password 
userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//match password
userSchema.methods.isPasswordMatched =  async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}


// used crypto for token
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 30*60*1000;
    return resetToken;
}

export default mongoose.model('User', userSchema);
