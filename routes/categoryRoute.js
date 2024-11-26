import express from "express"
import {createCategory,updateCategory,getCategory,getallCategory,deleteCategory} from '../controller/CategoryController.js'


import {authMiddleware, isAdmin} from '../middlewares/authMiddleware.js'


const categoryRouter = express.Router();

categoryRouter.post('/add',authMiddleware, isAdmin, createCategory);
categoryRouter.put('/:id',authMiddleware, isAdmin, updateCategory);
categoryRouter.delete('/:id', authMiddleware, isAdmin, deleteCategory);
categoryRouter.get('/getallcategory', getallCategory);
categoryRouter.get('/:id', getCategory);


export { categoryRouter as categoryRouter };