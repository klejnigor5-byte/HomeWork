function notFound(req, res, next) {
  res.status(404).json({ message: `Маршрут ${req.originalUrl} не знайдено.` });
}

function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({
    message: status === 500 ? 'Внутрішня помилка сервера.' : error.message
  });
}

module.exports = { notFound, errorHandler };
