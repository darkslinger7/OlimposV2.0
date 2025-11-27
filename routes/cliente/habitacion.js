const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([4]));

router.get('/habitacion', (req, res) => {
    const idHabitacion = req.session.usuario.id_habitacion;

    if(!idHabitacion) {
        return res.render('cliente/habitacion', { 
            titulo: 'Mi Habitación', icono: 'fa-bed', usuario: req.session.usuario, habitacion: null 
        });
    }

    const sql = `SELECT * FROM habitaciones WHERE id_habitacion = ?`;

    conexion.query(sql, [idHabitacion], (err, result) => {
        if (err) throw err;
        
        res.render('cliente/habitacion', {
            titulo: 'Mi Habitación',
            icono: 'fa-bed',
            usuario: req.session.usuario,
            habitacion: result[0]
        });
    });
});

module.exports = router;