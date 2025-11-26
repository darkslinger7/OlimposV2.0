const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([1]));

// Vista principal
router.get('/hoteles', (req, res) => {
  conexion.query('SELECT * FROM hoteles', (err, hoteles) => {
    if (err) throw err;
    res.locals.titulo = 'Hoteles';
    res.locals.icono = 'fa-hotel';
    res.render('super/hoteles', { hoteles });
  });
});

// Registrar hotel
router.post('/hoteles/registrar', (req, res) => {
  const { nombre, direccion, telefono, email, fecha_registro } = req.body;
  const sql = `
    INSERT INTO hoteles (nombre, direccion, telefono, email, fecha_registro)
    VALUES (?, ?, ?, ?, ?)
  `;
  conexion.query(sql, [nombre, direccion, telefono, email, fecha_registro], err => {
    if (err) throw err;
    res.redirect('/super/hoteles');
  });
});

// Eliminar hotel
router.get('/eliminarHotel/:id', (req, res) => {
  conexion.query('DELETE FROM hoteles WHERE id_hotel = ?', [req.params.id], err => {
    if (err) return res.status(500).send('Error al eliminar');
    res.sendStatus(200);
  });
});

module.exports = router;
