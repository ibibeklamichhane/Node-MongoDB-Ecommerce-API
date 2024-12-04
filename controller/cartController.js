import  User  from '../models/userModel.js';
import  Product  from '../models/productModel.js';

export const addToCart = async (req, res) => {
    const { product: productId, quantity } = req.body;
    console.log('productssssss',productId, quantity);
    const userId = req.user.id; // Retrieved from auth middleware

    try {
        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if product is already in the cart
        const existingItem = user.cart.find((item) => item.product.toString() === productId);

        if (existingItem) {
            // Update the quantity if product exists
            existingItem.quantity += quantity;
        } else {
            // Add new product to cart
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate('cart.product'); // Populate product details

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const { product } = req.params;
    const { quantity } = req.body;

    try {
        const user = await User.findById(userId);

        // Find the cart item
        const cartItem = user.cart.find(item => item.product.toString() === product);

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cartItem.quantity = quantity; // Update quantity

        await user.save();

        res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeCartItem = async (req, res) => {
    const userId = req.user.id;
    const { product } = req.params;

    try {
        const user = await User.findById(userId);

        // Filter out the product to remove it from the cart
        user.cart = user.cart.filter(item => item.product.toString() !== product);

        await user.save();

        res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
