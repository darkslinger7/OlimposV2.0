const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([4]));

// --- VER PAGOS ---
router.get('/pagos', (req, res) => {
    const cedula = req.session.usuario.cedula;

    // Buscamos pagos por cédula
    const sql = `SELECT * FROM pagos WHERE cedula = ? ORDER BY fecha_pago DESC`;

    conexion.query(sql, [cedula], (err, pagos) => {
        if (err) throw err;
        res.render('cliente/pagos', {
            titulo: 'Mis Pagos',
            icono: 'fa-credit-card',
            usuario: req.session.usuario,
            pagos
        });
    });
});

// --- REPORTAR PAGO ---
router.post('/pagos/reportar', (req, res) => {
    const { referencia, monto, tipo, banco } = req.body;
    const usuario = req.session.usuario;
    const fecha = new Date();

    // Recuperamos el nombre del hotel y habitación desde la BD o sesión
    // (Como en Admin pagos, pero simplificado)
    
    const sqlInsert = `
        INSERT INTO pagos 
        (num_referencia, monto_pago, tipo_pago, fecha_pago, nombre_p, cedula, bancoEmisor, Torre, apartamento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Torre = Nombre Hotel (Obtener de query adicional sería ideal, pero usaremos un placeholder si falla)
    // Haremos una consulta rápida para sacar el nombre del hotel actual
    const sqlHotel = `SELECT nombre FROM hoteles WHERE id_hotel = ?`;
    
    conexion.query(sqlHotel, [usuario.id_hotel], (errH, resH) => {
        const nombreHotel = (resH && resH.length > 0) ? resH[0].nombre : 'Hotel';
        const numHab = usuario.id_habitacion || 'Lobby'; // Deberíamos buscar el numero real, pero id sirve por ahora o hacemos join.
        // Para simplificar, usaremos el ID si no tenemos el numero a mano en sesion, pero lo ideal es tenerlo.
        // Asumiremos que en el dashboard ya consultamos eso.

        conexion.query(sqlInsert, [
            referencia, monto, tipo, fecha, 
            usuario.nombre_apellido, usuario.cedula, banco, 
            nombreHotel, numHab
        ], err => {
            if (err) { console.error(err); return res.status(500).send("Error"); }
            res.redirect('/cliente/pagos');
        });
    });
});

module.exports = router;