const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([1])); // Solo superusuario

// --- VISTA PRINCIPAL ---
router.get('/trabajadores', (req, res) => {
  // 1. Obtener lista de trabajadores (Usuarios con rol 3)
  const sqlTrabajadores = `
    SELECT u.id, u.nombre_apellido, u.cedula, u.telefono, u.sueldo, t.nombre AS nombre_trabajo
    FROM inf_usuarios u
    LEFT JOIN trabajos t ON u.id_trabajo = t.id_trabajo
    WHERE u.id_cargo = 3
    ORDER BY u.id DESC
  `;

  conexion.query(sqlTrabajadores, (err, trabajadores) => {
    if (err) throw err;

    // 2. Obtener lista de trabajos disponibles para el select
    conexion.query('SELECT * FROM trabajos', (err2, trabajos) => {
      if (err2) throw err2;

      res.render('super/trabajadores', {
        titulo: 'Gestión de Personal',
        icono: 'fa-id-badge',
        usuario: req.session.usuario || { nombre: 'Super Admin' },
        trabajadores,
        trabajos
      });
    });
  });
});

// --- ASIGNAR TRABAJO Y SUELDO ---
router.post('/trabajadores/asignar', (req, res) => {
  const { id_usuario, id_trabajo, sueldo } = req.body;
  
  // Actualizamos la tabla inf_usuarios
  const sql = 'UPDATE inf_usuarios SET id_trabajo = ?, sueldo = ? WHERE id = ?';
  
  conexion.query(sql, [id_trabajo, sueldo, id_usuario], err => {
    if (err) {
        console.error(err);
        return res.status(500).send("Error al asignar trabajo");
    }
    res.redirect('/super/trabajadores');
  });
});

// --- REGISTRAR NUEVO TIPO DE TRABAJO (ROL) ---
router.post('/trabajadores/registrarTrabajo', (req, res) => {
  const { nombre, descripcion } = req.body;
  const sql = 'INSERT INTO trabajos (nombre, descripcion) VALUES (?, ?)';
  
  conexion.query(sql, [nombre, descripcion], err => {
    if (err) throw err;
    res.redirect('/super/trabajadores');
  });
});

// --- ELIMINAR TIPO DE TRABAJO ---
router.get('/trabajadores/eliminarTrabajo/:id', (req, res) => {
  const id = req.params.id;
  conexion.query('DELETE FROM trabajos WHERE id_trabajo = ?', [id], err => {
    if (err) return res.status(500).send('Error al eliminar');
    res.sendStatus(200);
  });
});

module.exports = router;