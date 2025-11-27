const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

// Middleware: Solo Superusuario puede entrar aquí
router.use(verificarCargo([1]));

// --- VISTA DETALLADA DEL HOTEL (Dashboard de Gestión) ---
router.get('/gestion-hotel/:id', (req, res) => {
  const idHotel = req.params.id;

  // 1. Datos del Hotel
  const sqlHotel = "SELECT * FROM hoteles WHERE id_hotel = ?";
  
  // 2. Administradores asignados a este hotel
  const sqlAdminsAsignados = "SELECT * FROM inf_usuarios WHERE id_hotel = ? AND id_cargo = 2";
  
  // 3. Administradores DISPONIBLES (que no tienen hotel asignado) para poder asignarlos
  const sqlAdminsLibres = "SELECT * FROM inf_usuarios WHERE id_hotel IS NULL AND id_cargo = 2";
  
  // 4. Habitaciones del hotel (Resumen)
  const sqlHabitaciones = "SELECT * FROM habitaciones WHERE id_hotel = ?";

  conexion.query(sqlHotel, [idHotel], (err, resultHotel) => {
    if (err) throw err;
    if (resultHotel.length === 0) return res.redirect('/super/hoteles');

    conexion.query(sqlAdminsAsignados, [idHotel], (err2, adminsAsignados) => {
      if (err2) throw err2;

      conexion.query(sqlAdminsLibres, (err3, adminsLibres) => {
        if (err3) throw err3;

        conexion.query(sqlHabitaciones, [idHotel], (err4, habitaciones) => {
            if (err4) throw err4;

            res.render('super/gestion_hotel', {
                titulo: 'Configuración de Hotel',
                icono: 'fa-cogs',
                usuario: req.session.usuario || { nombre: 'Super Admin' },
                hotel: resultHotel[0],
                adminsAsignados,
                adminsLibres,
                habitaciones
            });
        });
      });
    });
  });
});

// --- EDITAR PROPIEDADES DEL HOTEL ---
router.post('/gestion-hotel/editar/:id', (req, res) => {
    const idHotel = req.params.id;
    const { nombre, direccion, telefono, email } = req.body;
    
    const sql = "UPDATE hoteles SET nombre = ?, direccion = ?, telefono = ?, email = ? WHERE id_hotel = ?";
    
    conexion.query(sql, [nombre, direccion, telefono, email, idHotel], (err) => {
        if (err) throw err; // Idealmente manejar con connect-flash
        res.redirect('/super/gestion-hotel/' + idHotel);
    });
});

// --- ASIGNAR ADMINISTRADOR AL HOTEL ---
router.post('/gestion-hotel/asignar-admin', (req, res) => {
    const { id_usuario, id_hotel } = req.body;
    
    // Actualizamos al usuario para ponerle este id_hotel
    const sql = "UPDATE inf_usuarios SET id_hotel = ? WHERE id = ?";
    
    conexion.query(sql, [id_hotel, id_usuario], (err) => {
        if (err) throw err;
        res.redirect('/super/gestion-hotel/' + id_hotel);
    });
});

// --- DESVINCULAR ADMINISTRADOR ---
router.get('/gestion-hotel/desvincular-admin/:idUsuario/:idHotel', (req, res) => {
    const { idUsuario, idHotel } = req.params;
    
    // Ponemos id_hotel en NULL
    const sql = "UPDATE inf_usuarios SET id_hotel = NULL WHERE id = ?";
    
    conexion.query(sql, [idUsuario], (err) => {
        if (err) throw err;
        res.redirect('/super/gestion-hotel/' + idHotel);
    });
});

module.exports = router;