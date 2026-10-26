const express = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
  res.json({
    message: 'Вітаємо! Ви отримали доступ до захищеного маршруту.',
    user: req.user
  });
});

module.exports = router;
