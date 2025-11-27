const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

// Middleware: Solo Administradores
router.use(verificarCargo([2]));

// --- IMPORTANTE: La ruta es '/habitaciones' ---
// Al unirse con '/administrador' en app.js, queda: /administrador/habitaciones
router.get('/habitaciones', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;

    const sql = `SELECT * FROM habitaciones WHERE id_hotel = ? ORDER BY numero ASC`;

    conexion.query(sql, [idHotel], (err, habitaciones) => {
        if (err) throw err;

        const total = habitaciones.length;
        const disponibles = habitaciones.filter(h => h.estado === 'disponible').length;
        const ocupadas = habitaciones.filter(h => h.estado === 'ocupada').length;
        const mantenimiento = habitaciones.filter(h => h.estado === 'mantenimiento').length;

        res.render('administrador/habitaciones', {
            titulo: 'Gestión de Habitaciones',
            icono: 'fa-bed',
            usuario: req.session.usuario,
            habitaciones,
            stats: { total, disponibles, ocupadas, mantenimiento }
        });
    });
});

// RUTAS POST (Registrar y Editar)
router.post('/habitaciones/registrar', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;
    const { numero, tipo, capacidad, precio, estado, tiene_televisor, tiene_wifi, tiene_jacuzzi, tiene_aire, tiene_minibar } = req.body;

    const sql = `INSERT INTO habitaciones (id_hotel, numero, tipo, capacidad, precio, estado, tiene_televisor, tiene_wifi, tiene_jacuzzi, tiene_aire, tiene_minibar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const valores = [idHotel, numero, tipo, capacidad, precio, estado, tiene_televisor?1:0, tiene_wifi?1:0, tiene_jacuzzi?1:0, tiene_aire?1:0, tiene_minibar?1:0];

    conexion.query(sql, valores, err => {
        if (err) throw err;
        res.redirect('/administrador/habitaciones');
    });
});

router.post('/habitaciones/editar', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;
    const { id_habitacion, numero, tipo, capacidad, precio, estado, tiene_televisor, tiene_wifi, tiene_jacuzzi, tiene_aire, tiene_minibar } = req.body;

    const sql = `UPDATE habitaciones SET numero=?, tipo=?, capacidad=?, precio=?, estado=?, tiene_televisor=?, tiene_wifi=?, tiene_jacuzzi=?, tiene_aire=?, tiene_minibar=? WHERE id_habitacion = ? AND id_hotel = ?`;
    
    const valores = [numero, tipo, capacidad, precio, estado, tiene_televisor?1:0, tiene_wifi?1:0, tiene_jacuzzi?1:0, tiene_aire?1:0, tiene_minibar?1:0, id_habitacion, idHotel];

    conexion.query(sql, valores, err => {
        if (err) throw err;
        res.redirect('/administrador/habitaciones');
    });
});

router.get('/habitaciones/eliminar/:id', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;
    conexion.query("DELETE FROM habitaciones WHERE id_habitacion = ? AND id_hotel = ?", [req.params.id, idHotel], err => {
        if (err) return res.status(500).send('Error');
        res.sendStatus(200);
    });
});

module.exports = router;