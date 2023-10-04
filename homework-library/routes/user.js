import express from 'express';

const userRouter = express.Router();

userRouter.get('/login', (req, res) => {
  res.status(201);
  res.json({ id: 1, mail: 'test@mail.ru' });
});

export default userRouter;
