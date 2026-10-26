function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    message: 'Доступ заборонено. Спочатку увійдіть в систему.'
  });
}

module.exports = { ensureAuthenticated };
