import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authroutes.js';   // Note the .js extension
import todoRoutes from './routes/todoroutes.js';  // Note the .js extension

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://todoassignmentalt-ayso.vercel.app',
    credentials: true
}));




// Routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));