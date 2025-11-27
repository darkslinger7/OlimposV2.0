const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

// Middleware: Solo Clientes (Rol 4)
router.use(verificarCargo([4]));

// --- VER PERFIL ---
router.get('/perfil', (req, res) => {
    const idUsuario = req.session.usuario.id;

    const sql = `SELECT * FROM inf_usuarios WHERE id = ?`;

    conexion.query(sql, [idUsuario], (err, usuario) => {
        if (err) throw err;
        
        res.render('cliente/perfil', {
            titulo: 'Mi Perfil',
            icono: 'fa-user-cog',
            usuario: req.session.usuario,
            datos: usuario[0]
        });
    });
});

// --- ACTUALIZAR DATOS ---
router.post('/perfil/actualizar', (req, res) => {
    const idUsuario = req.session.usuario.id;
    const { nombre, email, telefono, user, pass_new } = req.body;

    let sql = `UPDATE inf_usuarios SET nombre_apellido=?, email=?, telefono=?, usuario=?`;
    let params = [nombre, email, telefono, user];

    // Si el usuario escribió algo en "Nueva Contraseña", la actualizamos
    if (pass_new && pass_new.trim() !== '') {
        sql += `, clave=?`;
        params.push(pass_new);
    }

    sql += ` WHERE id=?`;
    params.push(idUsuario);

    conexion.query(sql, params, err => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al actualizar perfil");
        }
        
        // Actualizamos la sesión para que el nombre cambie en el navbar inmediatamente
        req.session.usuario.nombre_apellido = nombre;
        req.session.usuario.usuario = user;
        req.session.usuario.email = email;
        req.session.usuario.telefono = telefono;

        res.redirect('/cliente/perfil');
    });
});

module.exports = router;