import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', required: true }, 

    quantity: { 
        type: Number, required: true,
        default: 1 }, // Quantity of the product
});
/*
const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    cart: [CartItemSchema], // Cart items
}, { timestamps: true });
*/
export const Cart = mongoose.model('Cart', CartItemSchema);
