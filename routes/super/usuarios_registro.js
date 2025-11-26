const express = require('express');
const router = express.Router();
const conexion = require('../../config/conexion');
const link = require('../../config/link');

router.post('/regUsuario_admin', function(req, res) {
    const { name, user, pass, email, telefono, cedula, hotel, habitacion, cargo } = req.body;
    const fecha = new Date().toLocaleDateString('es-ES');
    const fechaSQL = new Date().toISOString().split('T')[0]; 

    const insertarUsuario = `
        INSERT INTO inf_usuarios (nombre_apellido, usuario, clave, email, telefono, cedula, edificio, apartamento, id_cargo, fecha)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const valoresUsuario = [name, user, pass, email, telefono, cedula, hotel, habitacion, cargo, fecha];

    conexion.query(insertarUsuario, valoresUsuario, function(err, resultado) {
        if (err) {
            console.log("❌ Error al registrar usuario", err);
            return res.status(500).send("Error al registrar usuario");
        }

        const id_usuario = resultado.insertId;
        console.log("✅ Usuario registrado con éxito");

        if (cargo === '2' || cargo === '3' || cargo === 2 || cargo === 3) {
            const insertarTrabajador = `
                INSERT INTO trabajador (id_usuario, funcion, horario, salario, fecha_ingreso)
                VALUES (?, ?, ?, ?, ?);
            `;
            const valoresTrabajador = [id_usuario, 'Sin asignar', '8am-4pm', 0, fechaSQL];

            conexion.query(insertarTrabajador, valoresTrabajador, function(err2) {
                if (err2) console.error("⚠️ Error al insertar en trabajador:", err2);
                else console.log("🛠️ Trabajador registrado");
            });
        }

        if (cargo === '4' || cargo === 4) {
            const insertarCliente = `
                INSERT INTO clientes (id_usuario, hotel, habitacion, fecha_registro)
                VALUES (?, ?, ?, ?);
            `;
            const valoresCliente = [id_usuario, hotel, habitacion, fechaSQL];

            conexion.query(insertarCliente, valoresCliente, function(err3) {
                if (err3) console.error("⚠️ Error al insertar en clientes:", err3);
                else console.log("🏨 Cliente registrado");
            });
        }

        res.redirect('/admin/user_admin');
    });
});

module.exports = router;

