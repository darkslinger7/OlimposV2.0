const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const link = require('../../config/link');

router.use(verificarCargo([2])); // Solo administrador de hotel

router.get('/trabajadores', (req, res) => {
  // Aquí iría la lógica para listar trabajadores del hotel asignado
  res.render('trabajador/trabajadores', {
    usuario: req.session.usuario,
    link
  });
});

module.exports = router;
