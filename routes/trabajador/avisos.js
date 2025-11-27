const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([3]));

router.get('/avisos', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;

    // Solo mostramos avisos GENERALES ('todos')
    // Las órdenes directas ('trabajador') ahora salen en el módulo de Tareas
    const sqlAvisos = `
        SELECT a.*, u.nombre_apellido as emisor 
        FROM avisos a
        JOIN inf_usuarios u ON a.id_emisor = u.id
        WHERE a.rol_destino = 'todos' 
        AND u.id_hotel = ?
        ORDER BY a.fecha DESC
    `;

    conexion.query(sqlAvisos, [idHotel], (err, avisos) => {
        if (err) throw err;
        res.render('trabajador/avisos', { // Asegúrate de actualizar la vista avisos.ejs para que sea solo lectura (sin botón completar)
            titulo: 'Tablón de Anuncios',
            icono: 'fa-bullhorn',
            usuario: req.session.usuario,
            avisos
        });
    });
});

module.exports = router;