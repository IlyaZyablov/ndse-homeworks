import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';
import UsersDB from '../database/models/users_schema.js';

const userRouter = express.Router();

const login = async (username, password, done) => {
  try {
    const user = await UsersDB.findOne({ username });

    if (!user) {
      done(null, false, {
        message: 'Пользователь с указанными параметрами не найден!',
      });
      return;
    }

    if (password !== user.password) {
      done(null, false, {
        message: 'Неверное имя пользователя или пароль!',
      });
      return;
    }

    done(null, user);
  } catch (error) {
    done(error);
    console.log(error);
  }
};

const register = async (username, password, done) => {
  try {
    const user = await UsersDB.findOne({ username });

    if (user) {
      done(null, false, {
        message: 'Пользователь с таким логином уже существует!',
      });
      return;
    }

    const newUser = new UsersDB({
      username,
      password,
    });

    await newUser.save();

    done(null, newUser);
  } catch (error) {
    done(error);
    console.log(error);
  }
};

const options = {
  usernameField: 'username',
  passwordField: 'password',
};

passport.use('login', new Strategy(options, login));
passport.use('register', new Strategy(options, register));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UsersDB.findById(id);

    done(null, user);
  } catch (error) {
    done(error);
    console.log(error);
  }
});

userRouter.get('/login', (req, res) => {
  let errorText = '';

  if (req.session.messages) {
    errorText = req.session.messages[0];
    req.session.messages = [];
  }

  res.render('users/login', {
    title: 'Авторизация',
    errorText,
  });
});

userRouter.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureMessage: true,
}));

userRouter.get('/register', (req, res) => {
  let errorText = '';

  if (req.session.messages) {
    errorText = req.session.messages[0];
    req.session.messages = [];
  }

  res.render('users/register', {
    title: 'Регистрация',
    errorText,
  });
});

userRouter.post('/register', passport.authenticate('register', {
  successRedirect: '/',
  failureRedirect: '/user/register',
  failureMessage: true,
}));

userRouter.get('/me',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.redirect('/user/login');
      return;
    }

    next();
  },
  async (req, res) => {
    try {
      const user = await UsersDB.findById(req.session.passport.user).select('username');

      res.render('users/profile', {
        title: 'Профиль',
        user,
      });
    } catch (error) {
      console.error(error);
      res.render('errors/404', {
        title: 'Ошибка!',
        text: 'Ошибка при загрузке профиля!',
      });
    }
  },
);

userRouter.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/user/login');
  });
});

export default userRouter;
