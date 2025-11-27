const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([4]));

// --- LISTAR MIS REPORTES ---
router.get('/avisos', (req, res) => {
    const idUsuario = req.session.usuario.id;

    const sql = `SELECT * FROM avisos WHERE id_emisor = ? ORDER BY fecha DESC`;

    conexion.query(sql, [idUsuario], (err, avisos) => {
        if (err) throw err;
        res.render('cliente/avisos', {
            titulo: 'Atención al Cliente',
            icono: 'fa-concierge-bell',
            usuario: req.session.usuario,
            avisos
        });
    });
});

// --- CREAR NUEVO REPORTE ---
router.post('/avisos/crear', (req, res) => {
    const { titulo, mensaje } = req.body;
    const idUsuario = req.session.usuario.id;

    // El rol_destino es 'administrador' para que el gerente lo vea
    const sql = `INSERT INTO avisos (titulo, mensaje, id_emisor, rol_emisor, rol_destino) VALUES (?, ?, ?, 'cliente', 'administrador')`;

    conexion.query(sql, [titulo, mensaje, idUsuario], err => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al enviar aviso");
        }
        res.redirect('/cliente/avisos');
    });
});

module.exports = router;