const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([1]));


router.get('/habitaciones', (req, res) => {
  const sql = `
    SELECT hab.*, h.nombre AS hotel_nombre
    FROM habitaciones hab
    LEFT JOIN hoteles h ON hab.id_hotel = h.id_hotel
  `;
  conexion.query(sql, (err, habitaciones) => {
    if (err) throw err;
    conexion.query('SELECT id_hotel, nombre FROM hoteles', (err2, hoteles) => {
      if (err2) throw err2;
      res.locals.titulo = 'Habitaciones';
    res.locals.icono = 'fa-bed';
    res.render('super/habitaciones', { habitaciones });
    });
  });
});

router.post('/habitaciones/registrar', (req, res) => {
  const {
    numero, tipo, capacidad, precio, estado, hotel,
    tiene_televisor, tiene_wifi, tiene_jacuzzi, tiene_aire, tiene_minibar
  } = req.body;

  const sql = `
    INSERT INTO habitaciones
    (numero, tipo, capacidad, precio, estado, id_hotel,
     tiene_televisor, tiene_wifi, tiene_jacuzzi, tiene_aire, tiene_minibar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  conexion.query(sql, [
    numero, tipo, capacidad, precio, estado, hotel,
    !!tiene_televisor, !!tiene_wifi, !!tiene_jacuzzi, !!tiene_aire, !!tiene_minibar
  ], err => {
    if (err) throw err;
    res.redirect('/super/habitaciones');
  });
});

router.get('/eliminarHabitacion/:id', (req, res) => {
  conexion.query('DELETE FROM habitaciones WHERE id_habitacion = ?', [req.params.id], err => {
    if (err) return res.status(500).send('Error al eliminar');
    res.sendStatus(200);
  });
});

module.exports = router;
