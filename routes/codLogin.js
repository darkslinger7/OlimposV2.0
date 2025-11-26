const express = require('express');
const router = express.Router();
const link = require('../config/link');
const conexion = require('../config/conexion');

router.post('/codLogin', function(req, res){
    const {user, pass} = req.body;

    const validar = `SELECT * FROM inf_usuarios WHERE usuario = ? AND clave = ?`;
    conexion.query(validar,[ user, pass ], async function(error, rows){
        let mensaje;
        if (error) {
            console.log("Error en la consulta de usuario", error);
            return res.status(500).send("Error en el servidor");
        }

        if (rows.length <= 0) {
            mensaje = "Usuario o contraseña incorrectos";
            return res.render('login', { mensaje, link });
        }

        const users = rows[0];

        if (!pass || !users.clave) {
            mensaje = "Contraseña incorrecta";
            return res.render('login', { mensaje, link });
        }

        req.session.login = true;
        req.session.usuario = {
            id: users.id,
            nombre_apellido: users.nombre_apellido,
            usuario: users.usuario,
            email: users.email,
            telefono: users.telefono,
            cedula: users.cedula,
            hotel: users.edificio, 
            habitacion: users.apartamento,
            id_cargo: users.id_cargo,
            fecha: users.fecha
        };


        console.log(req.session);
        const contador = `SELECT COUNT(*) AS total FROM inf_usuarios`;
        conexion.query(contador, function(err, result) {
            if (err) {
                console.error("Error al contar usuarios", err);
                return res.status(500).send("Error al contar usuarios");
            }
            req.session.totalUsuarios = result[0].total;
            console.log("Total de usuarios registrados:", req.session.totalUsuarios);
        });

        if (users.id_cargo === 1) {
            return res.redirect('/super/dashboard');
        } 
        else if (users.id_cargo === 2) {
            return res.redirect('/users');
        }
        else {
            mensaje = "Rol de usuario no válido";
            return res.render('login', { mensaje, link });
        }
    });
});

module.exports = router;