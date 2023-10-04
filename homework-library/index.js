import express from 'express';

import indexRouter from './routes/index.js';

const app = express();

app.use(express.json());

app.use('/api', indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
