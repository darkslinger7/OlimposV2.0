const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

// Middleware: Solo Administradores
router.use(verificarCargo([2]));

router.get('/dashboard', (req, res) => {
    // Verificamos que el usuario tenga un hotel asignado en su sesión
    const idHotel = req.session.usuario.id_hotel;

    if (!idHotel) {
        return res.send("Error: No tienes un hotel asignado. Contacta al Superusuario.");
    }

    // 1. OBTENER NOMBRE DEL HOTEL (Esto es lo que faltaba)
    const sqlInfoHotel = 'SELECT nombre FROM hoteles WHERE id_hotel = ?';

    // 2. Contadores para las tarjetas
    const sqlHabitaciones = 'SELECT COUNT(*) as total FROM habitaciones WHERE id_hotel = ?';
    const sqlDisponibles = "SELECT COUNT(*) as total FROM habitaciones WHERE id_hotel = ? AND estado = 'disponible'";
    const sqlTrabajadores = 'SELECT COUNT(*) as total FROM inf_usuarios WHERE id_hotel = ? AND id_cargo = 3';
    const sqlHuespedes = 'SELECT COUNT(*) as total FROM clientes WHERE id_hotel = ?';

    // Ejecución de consultas en cadena
    conexion.query(sqlInfoHotel, [idHotel], (err, resHotel) => {
        if (err) throw err;
        
        // Obtenemos el nombre o ponemos uno por defecto
        const nombreHotel = resHotel.length > 0 ? resHotel[0].nombre : 'Hotel Desconocido';

        conexion.query(sqlHabitaciones, [idHotel], (err2, resHab) => {
            if (err2) throw err2;
            
            conexion.query(sqlDisponibles, [idHotel], (err3, resDisp) => {
                if (err3) throw err3;

                conexion.query(sqlTrabajadores, [idHotel], (err4, resTrab) => {
                    if (err4) throw err4;

                    conexion.query(sqlHuespedes, [idHotel], (err5, resHues) => {
                        if (err5) throw err5;

                        const stats = {
                            habitaciones: resHab[0].total,
                            disponibles: resDisp[0].total,
                            ocupadas: resHab[0].total - resDisp[0].total,
                            trabajadores: resTrab[0].total,
                            huespedes: resHues[0].total
                        };

                        // Renderizamos enviando "nombreHotel" para que la vista no falle
                        res.render('administrador/dashboard', {
                            titulo: 'Panel de Control',
                            icono: 'fa-tachometer-alt',
                            usuario: req.session.usuario,
                            nombreHotel, // <--- ¡AQUÍ ESTÁ LA SOLUCIÓN!
                            stats
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;