import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
 
dotenv.config();
const app = express();

const PORT =process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5002',
    credentials: true
  })
);

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
  
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes)

app.listen(PORT, () => {
    console.log(`app is running on PORT:${PORT}`);
    connectDB();
})