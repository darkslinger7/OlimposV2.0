const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([3]));

router.get('/pagos', (req, res) => {
    const idUsuario = req.session.usuario.id;

    const sql = `
        SELECT u.sueldo, u.fecha as fecha_ingreso, t.nombre as cargo, h.nombre as hotel
        FROM inf_usuarios u
        LEFT JOIN trabajos t ON u.id_trabajo = t.id_trabajo
        LEFT JOIN hoteles h ON u.id_hotel = h.id_hotel
        WHERE u.id = ?
    `;

    conexion.query(sql, [idUsuario], (err, datos) => {
        if (err) throw err;

        res.render('trabajador/pagos', {
            titulo: 'Mi Nómina',
            icono: 'fa-file-invoice-dollar',
            usuario: req.session.usuario,
            info: datos[0]
        });
    });
});

module.exports = router;