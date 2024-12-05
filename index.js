import express from "express";
import { dbConnect } from "./config/dbConnect.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { authRouter } from "./routes/authRoute.js";
import { productRouter } from "./routes/productRoute.js";
//import { blogROuter } from "./routes/blogRoute.js";
import { cartRouter } from "./routes/cartRoute.js";

import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';



const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Enable sending cookies with cookies 
}));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(PORT, () => {
  console.log(`server is listening on port http://localhost:${PORT}`);
});

dbConnect();
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api", cartRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

