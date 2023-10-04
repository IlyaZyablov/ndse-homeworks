import express from 'express';
import booksRouter from './books.js';
import userRouter from './user.js';

const indexRouter = express.Router();

indexRouter.use('/books', booksRouter);
indexRouter.use('/user', userRouter);

export default indexRouter;
