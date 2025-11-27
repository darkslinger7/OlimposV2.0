const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([2])); // Solo Administradores

// La ruta es '/estadisticas' -> se convierte en '/administrador/estadisticas'
router.get('/estadisticas', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;

    const sqlIngresos = `
        SELECT DATE_FORMAT(p.fecha_pago, '%Y-%m') AS mes, SUM(p.monto_pago) AS total
        FROM pagos p
        JOIN inf_usuarios u ON p.cedula = u.cedula
        WHERE u.id_hotel = ?
        GROUP BY mes
        ORDER BY mes ASC
        LIMIT 6
    `;

    const sqlHuespedes = `
        SELECT DATE_FORMAT(fecha_registro, '%Y-%m') AS mes, COUNT(*) AS total
        FROM clientes
        WHERE id_hotel = ?
        GROUP BY mes
        ORDER BY mes ASC
        LIMIT 6
    `;

    const sqlHabitaciones = `
        SELECT estado, COUNT(*) as cantidad 
        FROM habitaciones 
        WHERE id_hotel = ? 
        GROUP BY estado
    `;

    conexion.query(sqlIngresos, [idHotel], (err, resIngresos) => {
        if (err) { console.error(err); return res.send("Error en ingresos"); }

        conexion.query(sqlHuespedes, [idHotel], (err2, resHuespedes) => {
            if (err2) { console.error(err2); return res.send("Error en huespedes"); }

            conexion.query(sqlHabitaciones, [idHotel], (err3, resHabitaciones) => {
                if (err3) { console.error(err3); return res.send("Error en habitaciones"); }

                const totalIngresosHist = resIngresos.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0);
                const totalHuespedesHist = resHuespedes.reduce((acc, curr) => acc + curr.total, 0);

                res.render('administrador/estadisticas', {
                    titulo: 'Estadísticas del Hotel',
                    icono: 'fa-chart-line',
                    usuario: req.session.usuario,
                    datos: {
                        ingresos: resIngresos,
                        huespedes: resHuespedes,
                        habitaciones: resHabitaciones,
                        resumen: { totalIngresosHist, totalHuespedesHist }
                    }
                });
            });
        });
    });
});

module.exports = router;