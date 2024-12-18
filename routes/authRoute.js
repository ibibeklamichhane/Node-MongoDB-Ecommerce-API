import express from "express";
import { createUser } from '../controller/UserController.js';
import {userLogin} from '../controller/UserController.js';
import {getallUser} from '../controller/UserController.js'
import {getSingleUser} from '../controller/UserController.js'
import {deleteSingleUser} from '../controller/UserController.js'
import {updateUser} from '../controller/UserController.js'



import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post('/register', createUser);
router.post('/login', userLogin);
router.get('/getallUser', getallUser);
router.get('/getSingleUser/:id', authMiddleware, isAdmin, getSingleUser);
router.delete('/deleteSingleUser/:id', deleteSingleUser );
router.put('/updateUser/:id', authMiddleware, updateUser);


export { router as authRouter };



// export const authRouter = () => {
//     const router = express.Router();
//     // router.post('/register', createUser);

//     app.use("/", (req,res)=> {
//         res.send("hello from server side");
//         });
// }

