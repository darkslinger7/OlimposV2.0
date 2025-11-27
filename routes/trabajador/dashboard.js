const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

// Middleware: Solo Trabajadores (Rol 3)
router.use(verificarCargo([3]));

// La ruta es '/dashboard' (que al sumarse en app.js queda: /trabajador/dashboard)
router.get('/dashboard', (req, res) => {
    const idUsuario = req.session.usuario.id;
    const idHotel = req.session.usuario.id_hotel;

    // 1. Obtener Info del Hotel y Puesto
    const sqlInfo = `
        SELECT h.nombre as nombre_hotel, t.nombre as nombre_trabajo, u.sueldo
        FROM inf_usuarios u
        LEFT JOIN hoteles h ON u.id_hotel = h.id_hotel
        LEFT JOIN trabajos t ON u.id_trabajo = t.id_trabajo
        WHERE u.id = ?
    `;

    // 2. Contar Avisos/Tareas Pendientes (Mensajes para 'trabajador' o 'todos')
    // Solo contamos los mensajes emitidos por administradores (cargo 2) de SU mismo hotel
    const sqlAvisos = `
        SELECT COUNT(*) as total 
        FROM avisos 
        WHERE (rol_destino = 'trabajador' OR rol_destino = 'todos') 
        AND id_emisor IN (SELECT id FROM inf_usuarios WHERE id_hotel = ? AND id_cargo = 2)
    `;

    conexion.query(sqlInfo, [idUsuario], (err, info) => {
        if (err) throw err;

        conexion.query(sqlAvisos, [idHotel], (err2, avisos) => {
            if (err2) throw err2;

            // Renderizamos la vista correcta
            res.render('trabajador/dashboard', {
                titulo: 'Mi Panel',
                icono: 'fa-home',
                usuario: req.session.usuario,
                datos: info[0] || {}, // Previene error si info viene vacío
                tareasPendientes: avisos[0] ? avisos[0].total : 0
            });
        });
    });
});

module.exports = router;  