const express = require('express');
const router = express.Router();
const conexion = require('../config/conexion');
const link = require('../config/link');

// Mostrar formulario de recuperación
router.get('/recuperar', (req, res) => {
    res.render('recuperar', link);
});

// Verificar si el correo existe en la base de datos
router.post('/verificar-correo', (req, res) => {
    const { email } = req.body;

    const sql = 'SELECT * FROM inf_usuarios WHERE email = ?';
    conexion.query(sql, [email], (err, resultados) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (resultados.length > 0) {
            console.log('El correo existe en la base de datos');
            res.json({ existe: true });
        } else {
            console.log('El correo no existe en la base de datos');
            res.json({ existe: false });
        }
    });
});

router.post('/cambiar-clave', (req, res) => {
    const { email, newPassword } = req.body; 
    
    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const sql = 'UPDATE inf_usuarios SET clave = ? WHERE email = ?';
    const valores = [newPassword, email];

    conexion.query(sql, valores, (err, result) => {
        if (err) {
            console.error('Error al actualizar la clave:', err);
            return res.status(500).json({ error: 'Error al actualizar la clave' });
        }

        if (result.affectedRows > 0) {
            console.log('La clave del usuario ha sido actualizada con éxito');
            res.json({ ok: true });
        } else {
            res.json({ ok: false, error: 'No se pudo actualizar la contraseña' });
        }
    });
});

module.exports = router;