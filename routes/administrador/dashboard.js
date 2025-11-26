const express = require('express');
const router = express.Router();

// al menos una ruta
router.get('/', (req, res) => {
  res.send('Ruta en construcción');
});

module.exports = router;
