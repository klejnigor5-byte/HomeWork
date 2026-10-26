function validateRegistration(req, res, next) {
  const { email, password } = req.body;

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ message: 'Вкажіть коректний email.' });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Пароль має містити щонайменше 8 символів.' });
  }

  return next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return res.status(400).json({ message: 'Потрібно вказати email і пароль.' });
  }

  return next();
}

module.exports = { validateRegistration, validateLogin };
