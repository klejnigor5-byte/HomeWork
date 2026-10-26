const express = require('express');
const passport = require('passport');
const { registerUser } = require('../config/passport');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegistration, async (req, res, next) => {
  try {
    const user = await registerUser(req.body.email, req.body.password);
    // Automatically sign in after successful registration.
    req.login(user, (error) => {
      if (error) return next(error);
      return res.status(201).json({
        message: 'Реєстрація успішна.',
        user
      });
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validateLogin, (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return next(error);
    if (!user) {
      return res.status(401).json({ message: info?.message || 'Не вдалося увійти.' });
    }

    req.login(user, (loginError) => {
      if (loginError) return next(loginError);
      return res.json({ message: 'Вхід успішний.', user });
    });
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    req.session.destroy((sessionError) => {
      if (sessionError) return next(sessionError);
      res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      return res.json({ message: 'Вихід виконано успішно.' });
    });
  });
});

router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Ви не авторизовані.' });
  }
  return res.json({ user: req.user });
});

module.exports = router;
