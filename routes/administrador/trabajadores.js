const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([2])); // Solo Administradores

// --- VISTA DE NÓMINA ---
router.get('/trabajadores', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;

    // Buscar trabajadores de ESTE hotel (cargo 3)
    const sqlTrabajadores = `
        SELECT u.id, u.nombre_apellido, u.cedula, u.telefono, u.email, u.sueldo, 
               t.nombre AS nombre_trabajo, u.fecha
        FROM inf_usuarios u
        LEFT JOIN trabajos t ON u.id_trabajo = t.id_trabajo
        WHERE u.id_hotel = ? AND u.id_cargo = 3
        ORDER BY u.nombre_apellido ASC
    `;

    // Buscar cargos disponibles
    const sqlCargos = 'SELECT * FROM trabajos';

    conexion.query(sqlTrabajadores, [idHotel], (err, trabajadores) => {
        if (err) throw err;

        conexion.query(sqlCargos, (err2, cargos) => {
            if (err2) throw err2;

            const totalNomina = trabajadores.reduce((sum, t) => sum + (parseFloat(t.sueldo) || 0), 0);

            res.render('administrador/trabajadores', {
                titulo: 'Gestión de Nómina',
                icono: 'fa-users',
                usuario: req.session.usuario,
                trabajadores,
                cargos,
                totalNomina
            });
        });
    });
});

// --- 👇 ESTA ES LA RUTA QUE TE FALTA O NO ESTÁ CARGANDO 👇 ---
// REGISTRAR TRABAJADOR (CONTRATACIÓN)
router.post('/trabajadores/registrar', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;
    const { name, user, pass, email, telefono, cedula, id_trabajo, sueldo } = req.body;
    const fecha = new Date().toLocaleDateString('es-ES');

    const sql = `
        INSERT INTO inf_usuarios 
        (nombre_apellido, usuario, clave, email, telefono, cedula, id_cargo, id_hotel, id_trabajo, sueldo, fecha)
        VALUES (?, ?, ?, ?, ?, ?, 3, ?, ?, ?, ?)
    `;

    // Valores (si id_trabajo o sueldo vienen vacíos, ponemos null/0)
    const valores = [
        name, user, pass, email, telefono, cedula, 
        idHotel, 
        id_trabajo || null, 
        sueldo || 0, 
        fecha
    ];

    conexion.query(sql, valores, (err) => {
        if (err) {
            console.error("Error al registrar trabajador:", err);
            return res.status(500).send("Error al registrar. Verifique datos.");
        }
        res.redirect('/administrador/trabajadores');
    });
});

// --- EDITAR NÓMINA ---
router.post('/trabajadores/asignar', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;
    const { id_usuario, id_trabajo, sueldo } = req.body;

    const sql = 'UPDATE inf_usuarios SET id_trabajo = ?, sueldo = ? WHERE id = ? AND id_hotel = ?';

    conexion.query(sql, [id_trabajo, sueldo, id_usuario, idHotel], (err) => {
        if (err) { console.error(err); return res.status(500).send("Error"); }
        res.redirect('/administrador/trabajadores');
    });
});

// --- DESVINCULAR TRABAJADOR ---
router.get('/trabajadores/desvincular/:id', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;
    const idUsuario = req.params.id;

    const sql = 'UPDATE inf_usuarios SET id_hotel = NULL, id_trabajo = NULL, sueldo = 0 WHERE id = ? AND id_hotel = ?';

    conexion.query(sql, [idUsuario, idHotel], err => {
        if (err) return res.status(500).send('Error al desvincular');
        res.sendStatus(200);
    });
});

module.exports = router;