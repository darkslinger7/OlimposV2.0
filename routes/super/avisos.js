const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([1])); // solo superusuario


router.get('/avisos', (req, res) => {
  const sql = `
    SELECT a.*, u.nombre_apellido AS emisor
    FROM avisos a
    LEFT JOIN inf_usuarios u ON a.id_emisor = u.id
    ORDER BY a.fecha DESC
  `;
  conexion.query(sql, (err, avisos) => {
    if (err) throw err;
    res.locals.titulo = 'Avisos';
    res.locals.icono = 'fa-bullhorn';
    res.render('super/avisos', { avisos });
  });
});


router.post('/avisos', (req, res) => {
  const { titulo, mensaje, rol_destino } = req.body;
  const sql = `
    INSERT INTO avisos (titulo, mensaje, id_emisor, rol_emisor, rol_destino)
    VALUES (?, ?, ?, 'super', ?)
  `;
  conexion.query(sql, [titulo, mensaje, req.session.usuario.id, rol_destino], err => {
    if (err) throw err;
    res.redirect('/super/avisos');
  });
});


router.get('/avisos/eliminar/:id', (req, res) => {
  conexion.query('DELETE FROM avisos WHERE id_aviso = ?', [req.params.id], err => {
    if (err) return res.status(500).send('Error al eliminar');
    res.sendStatus(200);
  });
});

module.exports = router;
