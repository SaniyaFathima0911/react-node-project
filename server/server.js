import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json());

app.use('/api/users', userRoutes);

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5001;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server is running on port: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Connection error:', error.message);
  });
