const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([1]));

router.get('/pagos', (req, res) => {
  res.locals.titulo = 'Pagos';
  res.locals.icono = 'fa-money-bill';
  res.render('super/pagos');
});

module.exports = router;
