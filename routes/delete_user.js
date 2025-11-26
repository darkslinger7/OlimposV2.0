const express = require('express');
const router = express.Router();
const conexion = require('../config/conexion');
const verificarCargo = require('../middlewares/verificarCargo');

router.get('/eliminarUsuario/:id', verificarCargo([1]), (req, res) => {
  const id = req.params.id;

  const eliminar = 'DELETE FROM inf_usuarios WHERE id = ?';
  conexion.query(eliminar, [id], (error, resultados) => {
    if (error) {
      console.error('Error al eliminar usuario:', error);
      return res.status(500).send('Error del servidor.');
    }

    console.log("✅ Usuario eliminado con éxito");
    res.redirect('/admin/user_admin');
  });
});

module.exports = router;
