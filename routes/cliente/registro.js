const express = require('express');
const router = express.Router();
const conexion = require('../../config/conexion');
const link = require('../../config/link');

router.post('/registro', function(req, res) {
    const { name, user, pass, email, telefono, cedula, edificio, apartamento, cargo } = req.body;
    const fecha = new Date().toLocaleDateString('es-ES');

    const insertarUsuario = `
        INSERT INTO inf_usuarios (nombre_apellido, usuario, clave, email, telefono, cedula, edificio, apartamento, id_cargo, fecha)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const valoresUsuario = [name, user, pass, email, telefono, cedula, edificio, apartamento, cargo, fecha];

    conexion.query(insertarUsuario, valoresUsuario, function(err, resultado) {
        if (err) {
            console.error("❌ Error al insertar el usuario:", err);
            return res.status(500).send("Error al registrar usuario");
        }

        console.log("✅ Usuario insertado correctamente");

        // Obtener el ID recién insertado
        const id_usuario = resultado.insertId;

        // Si el cargo es 2 o 3, insertar en tabla trabajador
        if (cargo === '2' || cargo === '3' || cargo === 2 || cargo === 3) {
            const insertarTrabajador = `
                INSERT INTO trabajador (id_usuario, funcion, horario, salario, fecha_ingreso)
                VALUES (?, ?, ?, ?, CURDATE());
            `;
            const valoresTrabajador = [id_usuario, 'Sin asignar', '8am-4pm', 0];

            conexion.query(insertarTrabajador, valoresTrabajador, function(err2) {
                if (err2) {
                    console.error("⚠️ Error al insertar en trabajador:", err2);
                    // No detenemos el flujo, solo registramos el error
                } else {
                    console.log("🛠️ Trabajador registrado en tabla extendida");
                }
            });
        }

        const mensaje = "Usuario registrado correctamente. Ya puede iniciar sesión.";
        res.render("login", { mensaje, linkLogin: link.linkLogin });
    });
});

module.exports = router;

