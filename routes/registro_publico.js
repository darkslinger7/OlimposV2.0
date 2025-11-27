const express = require('express');
const router = express.Router();
const conexion = require('../config/conexion');

router.post('/auth/registro_publico', (req, res) => {
    const { name, cedula, email, telefono, user, pass } = req.body;
    const fecha = new Date().toLocaleDateString('es-ES');
    const fechaSQL = new Date().toISOString().split('T')[0];

    // 1. Verificamos si el usuario o cédula ya existen
    const sqlCheck = "SELECT * FROM inf_usuarios WHERE usuario = ? OR cedula = ?";
    
    conexion.query(sqlCheck, [user, cedula], (err, result) => {
        if (err) { console.error(err); return res.send("Error en el servidor"); }
        
        if (result.length > 0) {
            return res.send("<script>alert('El usuario o la cédula ya están registrados.'); window.history.back();</script>");
        }

        // 2. Insertamos el nuevo usuario como CLIENTE (Rol 4)
        // Dejamos id_hotel, id_habitacion y id_trabajo en NULL por ahora
        const sqlInsert = `
            INSERT INTO inf_usuarios 
            (nombre_apellido, usuario, clave, email, telefono, cedula, id_cargo, fecha) 
            VALUES (?, ?, ?, ?, ?, ?, 4, ?)
        `;

        conexion.query(sqlInsert, [name, user, pass, email, telefono, cedula, fecha], (err2, resInsert) => {
            if (err2) { console.error(err2); return res.send("Error al registrar"); }

            // 3. Insertamos también en la tabla 'clientes' para mantener consistencia
            const idNuevoUsuario = resInsert.insertId;
            const sqlCliente = "INSERT INTO clientes (id_usuario, fecha_registro) VALUES (?, ?)";
            
            conexion.query(sqlCliente, [idNuevoUsuario, fechaSQL], (err3) => {
                if (err3) console.error("Error insertando en clientes:", err3);
                
                // Redirigimos al login con éxito
                res.send("<script>alert('¡Registro exitoso! Ahora puedes iniciar sesión.'); window.location.href='/login';</script>");
            });
        });
    });
});

module.exports = router;