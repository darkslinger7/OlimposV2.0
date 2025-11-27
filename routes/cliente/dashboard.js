const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

// Middleware: Solo Clientes (Rol 4)
router.use(verificarCargo([4]));

router.get('/dashboard', (req, res) => {
    const idUsuario = req.session.usuario.id;

    // Buscamos datos del Hotel y la Habitación
    const sqlInfo = `
        SELECT u.nombre_apellido, h.nombre AS hotel, hab.numero, hab.tipo, c.fecha_registro
        FROM inf_usuarios u
        LEFT JOIN hoteles h ON u.id_hotel = h.id_hotel
        LEFT JOIN habitaciones hab ON u.id_habitacion = hab.id_habitacion
        LEFT JOIN clientes c ON u.id = c.id_usuario
        WHERE u.id = ?
    `;

    conexion.query(sqlInfo, [idUsuario], (err, data) => {
        if (err) throw err;

        // Si no tiene habitación asignada (ej. acaba de registrarse pero no ha hecho check-in)
        const info = data[0] || {}; 

        res.render('cliente/dashboard', {
            titulo: 'Mi Estancia',
            icono: 'fa-home',
            usuario: req.session.usuario,
            info
        });
    });
});

module.exports = router;