// routes/.../nombre.js
const express = require('express');
const router = express.Router();

// Ruta temporal para evitar errores
router.get('/', (req, res) => {
  res.send('Ruta en construcción: hoteles.js');
});

module.exports = router;
