import express from "express"
import {createProduct} from '../controller/productController.js'
import {getProductById} from '../controller/productController.js'
import {getAllProduct} from '../controller/productController.js'
import {updateProduct} from '../controller/productController.js'
import {deleteProduct} from '../controller/productController.js'
import {authMiddleware, isAdmin} from '../middlewares/authMiddleware.js'

const productRouter = express.Router();

productRouter.post('/add',authMiddleware, isAdmin, createProduct);
productRouter.put('/:id',authMiddleware, isAdmin, updateProduct);
productRouter.delete('/:id', authMiddleware, isAdmin, deleteProduct);
productRouter.get('/getallproducts', getAllProduct);
productRouter.get('/:id', getProductById);


export { productRouter as productRouter };