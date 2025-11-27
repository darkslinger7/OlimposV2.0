const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo'); 
const conexion = require('../../config/conexion'); 


router.use(verificarCargo([1]));


router.get('/habitaciones', (req, res) => {
  
  const sqlHabitaciones = `
    SELECT hab.*, h.nombre AS nombre_hotel
    FROM habitaciones hab
    LEFT JOIN hoteles h ON hab.id_hotel = h.id_hotel
    ORDER BY hab.id_hotel, hab.numero
  `;
  
  conexion.query(sqlHabitaciones, (err, habitaciones) => {
    if (err) {
      console.error("Error al obtener habitaciones:", err);
      return res.status(500).send("Error en la base de datos");
    }
    
    
    conexion.query('SELECT id_hotel, nombre FROM hoteles', (err2, hoteles) => {
      if (err2) {
        console.error("Error al obtener hoteles:", err2);
        return res.status(500).send("Error al cargar hoteles");
      }
      
     
      res.locals.titulo = 'Gestión de Habitaciones';
      res.locals.icono = 'fa-bed';
      
      res.render('super/habitaciones', { 
        habitaciones, 
        hoteles 
      });
    });
  });
});


router.post('/habitaciones/registrar', (req, res) => {
  const {
    numero, tipo, capacidad, precio, estado, id_hotel, 
    tiene_televisor, tiene_wifi, tiene_jacuzzi, tiene_aire, tiene_minibar
  } = req.body;

  const sql = `
    INSERT INTO habitaciones
    (numero, tipo, capacidad, precio, estado, id_hotel,
     tiene_televisor, tiene_wifi, tiene_jacuzzi, tiene_aire, tiene_minibar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

 
  const valores = [
    numero, tipo, capacidad, precio, estado, id_hotel,
    tiene_televisor ? 1 : 0,
    tiene_wifi ? 1 : 0,
    tiene_jacuzzi ? 1 : 0,
    tiene_aire ? 1 : 0,
    tiene_minibar ? 1 : 0
  ];

  conexion.query(sql, valores, err => {
    if (err) {
      console.error("Error al registrar habitación:", err);
      return res.status(500).send("Error al registrar");
    }
    res.redirect('/super/habitaciones');
  });
});


router.get('/eliminarHabitacion/:id', (req, res) => {
  const id = req.params.id;
  conexion.query('DELETE FROM habitaciones WHERE id_habitacion = ?', [id], err => {
    if (err) {
      console.error("Error al eliminar habitación:", err);
      return res.status(500).send('Error al eliminar');
    }
    res.sendStatus(200); 
  });
});

module.exports = router;