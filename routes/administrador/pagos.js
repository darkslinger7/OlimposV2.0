const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

// Middleware: Solo Administradores
router.use(verificarCargo([2]));

// --- VISTA DE FINANZAS ---
router.get('/pagos', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;

    // 1. INGRESOS (Pagos de Clientes)
    // Filtramos por la cédula del usuario asociado al hotel
    const sqlIngresos = `
        SELECT p.*, u.nombre_apellido 
        FROM pagos p
        JOIN inf_usuarios u ON p.cedula = u.cedula
        WHERE u.id_hotel = ?
        ORDER BY p.fecha_pago DESC
    `;

    // 2. EGRESOS (Nómina)
    const sqlNomina = `
        SELECT SUM(sueldo) AS total_nomina 
        FROM inf_usuarios 
        WHERE id_hotel = ? AND id_cargo = 3
    `;

    conexion.query(sqlIngresos, [idHotel], (err, pagosClientes) => {
        if (err) throw err;

        conexion.query(sqlNomina, [idHotel], (err2, resultNomina) => {
            if (err2) throw err2;

            const totalIngresos = pagosClientes.reduce((sum, p) => sum + (parseFloat(p.monto_pago) || 0), 0);
            const totalNomina = parseFloat(resultNomina[0].total_nomina) || 0;
            const balance = totalIngresos - totalNomina;

            res.render('administrador/pagos', {
                titulo: 'Finanzas del Hotel',
                icono: 'fa-cash-register',
                usuario: req.session.usuario,
                pagos: pagosClientes,
                finanzas: {
                    ingresos: totalIngresos,
                    egresos: totalNomina,
                    balance: balance
                }
            });
        });
    });
});


router.post('/pagos/registrar', (req, res) => {
    const { cedula, monto, referencia, tipo, concepto } = req.body;
    const fecha = new Date();

   
    const sqlBuscarInfo = `
        SELECT u.nombre_apellido, 
               h.numero AS num_habitacion, 
               hot.nombre AS nombre_hotel 
        FROM inf_usuarios u
        LEFT JOIN habitaciones h ON u.id_habitacion = h.id_habitacion
        LEFT JOIN hoteles hot ON u.id_hotel = hot.id_hotel
        WHERE u.cedula = ?
    `;
    
    conexion.query(sqlBuscarInfo, [cedula], (err, resultados) => {
        if (err || resultados.length === 0) {
            console.error("Error o cliente no encontrado:", err);
           
            return res.redirect('/administrador/pagos'); 
        }

        const cliente = resultados[0];
        
        
        const nombreHotel = cliente.nombre_hotel || 'Desconocido';
        const numHabitacion = cliente.num_habitacion || 'Lobby';

        
       
        const sqlInsert = `
            INSERT INTO pagos 
            (num_referencia, monto_pago, tipo_pago, fecha_pago, nombre_p, cedula, bancoEmisor, Torre, apartamento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        
        conexion.query(sqlInsert, [
            referencia, 
            monto, 
            tipo, 
            fecha, 
            cliente.nombre_apellido, 
            cedula, 
            concepto || 'Servicios', 
            nombreHotel,             
            numHabitacion            
        ], errInsert => {
            if (errInsert) console.error(errInsert);
            res.redirect('/administrador/pagos');
        });
    });
});

module.exports = router;