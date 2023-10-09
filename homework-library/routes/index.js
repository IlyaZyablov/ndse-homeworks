import express from 'express';
import booksRouter from './books.js';
import userRouter from './user.js';

const indexRouter = express.Router();

indexRouter.use('/books', booksRouter);
indexRouter.use('/user', userRouter);

indexRouter.get('/', (req, res) => {
  res.render('index', {
    title: 'Главная',
  });
});

export default indexRouter;
