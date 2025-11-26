const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const link = require('../../config/link');

router.use(verificarCargo([1])); 


router.get('/dashboard', (req, res) => {
  res.locals.titulo = 'Dashboard';
  res.locals.icono = 'fa-home';
  res.render('super/dashboard');
});

module.exports = router;
