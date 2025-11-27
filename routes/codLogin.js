const express = require('express');
const router = express.Router();
const link = require('../config/link');
const conexion = require('../config/conexion');

router.post('/codLogin', function(req, res){
    const {user, pass} = req.body;

    // Validación básica de seguridad
    if (!user || !pass) {
        return res.render('login', { mensaje: "Por favor ingrese usuario y contraseña", link });
    }

    const validar = `SELECT * FROM inf_usuarios WHERE usuario = ? AND clave = ?`;
    
    conexion.query(validar, [user, pass], function(error, rows){
        if (error) {
            console.error("Error en login:", error);
            return res.status(500).send("Error en el servidor");
        }

        if (rows.length <= 0) {
            return res.render('login', { mensaje: "Usuario o contraseña incorrectos", link });
        }

        const usuarioEncontrado = rows[0];

        // --- AQUÍ ESTABA EL DETALLE IMPORTANTE ---
        // Guardamos en sesión los datos CORRECTOS de la base de datos (id_hotel, id_habitacion)
        req.session.login = true;
        req.session.usuario = {
            id: usuarioEncontrado.id,
            nombre_apellido: usuarioEncontrado.nombre_apellido,
            usuario: usuarioEncontrado.usuario,
            email: usuarioEncontrado.email,
            telefono: usuarioEncontrado.telefono,
            cedula: usuarioEncontrado.cedula,
            id_hotel: usuarioEncontrado.id_hotel,        // ¡Esto es lo que necesita el Dashboard Admin!
            id_habitacion: usuarioEncontrado.id_habitacion,
            id_cargo: usuarioEncontrado.id_cargo,
            fecha: usuarioEncontrado.fecha
        };

        console.log("✅ Sesión iniciada para:", req.session.usuario.usuario, "| Rol:", req.session.usuario.id_cargo);

        // --- REDIRECCIONES SEGÚN ROL ---
        switch(usuarioEncontrado.id_cargo) {
            case 1: // Superusuario
                res.redirect('/super/dashboard');
                break;
            case 2: // Administrador
                if (!usuarioEncontrado.id_hotel) {
                    // Seguridad: Si es admin pero no tiene hotel, no lo dejamos pasar
                    req.session.destroy();
                    return res.render('login', { mensaje: "Error: Cuenta de Administrador sin hotel asignado.", link });
                }
                res.redirect('/administrador/dashboard');
                break;
            case 3: // Trabajador
                res.redirect('/trabajador/dashboard');
                break;
            case 4: // Cliente / Residente
                res.redirect('/cliente/dashboard');
                break;
            default:
                res.render('login', { mensaje: "Rol de usuario no reconocido", link });
        }
    });
});

module.exports = router;