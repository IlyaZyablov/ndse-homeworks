import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';

import indexRouter from './routes/index.js';

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.use(session({ secret: 'SECRET' }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;

async function mongoConnect(url) {
  try {
    await mongoose.connect(url);

    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  } catch (error) {
    console.log('[ERROR]: Database connect error:');
    console.error(error);
  }
}

mongoConnect(process.env.MONGO_URL);
