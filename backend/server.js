import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';


import emailRoutes from './routes/emailRoutes.js';
import emailFPRoutes from './routes/emailForgotPassword.js';
import orderRoutes from './routes/orderRoutes.js';
import emailOrderRoutes from './routes/emailOrderRoutes.js';
import cors from 'cors';
import { log } from 'console';
import checkoutRoutes  from "./routes/checkoutRoutes.js";
import bodyParser from 'body-parser';

const port = process.env.PORT || 5000;

connectDB();
// const emailRoutes = require('./routes/emailRoutes');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Routes
app.use('/change/email', emailFPRoutes);
app.use('/email', emailRoutes); // Base path for email-related routes
app.use('/email/order', emailOrderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/order', orderRoutes);

app.use(bodyParser.json());
app.use("/api", checkoutRoutes);

if (process.env.NODE_ENV === 'production') {
  //console.log('Production');
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, './frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));