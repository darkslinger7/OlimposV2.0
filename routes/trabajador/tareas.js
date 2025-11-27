const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([3]));

// --- VER LISTA DE TAREAS ---
router.get('/tareas', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;

    // Buscamos avisos dirigidos EXCLUSIVAMENTE a trabajadores (ignoramos 'todos' o 'clientes')
    // Asumimos que los avisos directos al rol 'trabajador' son órdenes de trabajo.
    const sqlTareas = `
        SELECT a.*, u.nombre_apellido as asignado_por 
        FROM avisos a
        JOIN inf_usuarios u ON a.id_emisor = u.id
        WHERE a.rol_destino = 'trabajador' 
        AND u.id_hotel = ?
        ORDER BY a.fecha DESC
    `;

    conexion.query(sqlTareas, [idHotel], (err, tareas) => {
        if (err) throw err;

        res.render('trabajador/tareas', {
            titulo: 'Lista de Tareas',
            icono: 'fa-clipboard-list',
            usuario: req.session.usuario,
            tareas
        });
    });
});

// --- COMPLETAR TAREA ---
router.get('/tareas/completar/:id', (req, res) => {
    // Al "completar", borramos el aviso de la lista.
    // (En un sistema futuro podrías moverlo a una tabla 'tareas_historial')
    const sql = "DELETE FROM avisos WHERE id_aviso = ?";
    
    conexion.query(sql, [req.params.id], err => {
        if (err) return res.status(500).send("Error");
        res.redirect('/trabajador/tareas');
    });
});

module.exports = router;