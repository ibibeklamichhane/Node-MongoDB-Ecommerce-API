import express from 'express';
import { addToCart, getCart, updateCartItem, removeCartItem } from '../controller/cartController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/cart', authMiddleware, addToCart);       // Add item to cart
router.get('/cart', authMiddleware, getCart);          // Get cart items
router.put('/cart/:productId', authMiddleware, updateCartItem); // Update quantity
router.delete('/cart/:productId', authMiddleware, removeCartItem); // Remove item

export { router as cartRouter };
