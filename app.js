const express = require('express');
const session = require('express-session');
const passport = require('passport');
const configurePassport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

configurePassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    name: 'connect.sid',
    secret: process.env.SESSION_SECRET || 'development-only-change-this-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({
    message: 'Express Passport Authentication API',
    routes: {
      register: 'POST /auth/register',
      login: 'POST /auth/login',
      logout: 'POST /auth/logout',
      currentUser: 'GET /auth/me',
      protected: 'GET /protected'
    }
  });
});

app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
