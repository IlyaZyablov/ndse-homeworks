import express from 'express';
import booksRouter from './books.js';
import userRouter from './user.js';

const indexRouter = express.Router();

indexRouter.use('/user', userRouter);

indexRouter.use((req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/user/login');
    return;
  }

  next();
});

indexRouter.use('/books', booksRouter);

indexRouter.get('/', (req, res) => {
  res.render('index', {
    title: 'Главная',
  });
});

export default indexRouter;
