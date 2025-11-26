const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([1])); // Solo superusuario

router.get('/usuarios', (req, res) => {
  const sqlUsuarios = `
    SELECT u.*, h.nombre AS hotel_nombre, hab.numero AS habitacion_numero
    FROM inf_usuarios u
    LEFT JOIN hoteles h ON u.id_hotel = h.id_hotel
    LEFT JOIN habitaciones hab ON u.id_habitacion = hab.id_habitacion
  `;
  const sqlHoteles = 'SELECT id_hotel, nombre FROM hoteles';
  const sqlHabitaciones = 'SELECT id_habitacion, numero FROM habitaciones';

  conexion.query(sqlUsuarios, (errUsuarios, usuarios) => {
    if (errUsuarios) throw errUsuarios;

    conexion.query(sqlHoteles, (errHoteles, hoteles) => {
      if (errHoteles) throw errHoteles;

      conexion.query(sqlHabitaciones, (errHabitaciones, habitaciones) => {
        if (errHabitaciones) throw errHabitaciones;

        // Solo pasamos los datos dinámicos
        res.locals.titulo = 'Usuarios';
        res.locals.icono = 'fa-user';
        res.render('super/usuarios', { usuarios, hoteles, habitaciones });
      });
    });
  });
});

router.post('/usuarios/registrar', (req, res) => {
  const { name, user, pass, email, telefono, cedula, cargo, hotel, habitacion } = req.body;
  const sql = `
    INSERT INTO inf_usuarios 
    (nombre_apellido, usuario, clave, email, telefono, cedula, id_cargo, id_hotel, id_habitacion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const valores = [name, user, pass, email, telefono, cedula, cargo, hotel, habitacion];

  conexion.query(sql, valores, (err) => {
    if (err) throw err;
    res.redirect('/super/usuarios');
  });
});

router.get('/eliminarUsuario/:id', (req, res) => {
  const id = req.params.id;
  conexion.query('DELETE FROM inf_usuarios WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send('Error al eliminar');
    res.sendStatus(200);
  });
});

module.exports = router;

