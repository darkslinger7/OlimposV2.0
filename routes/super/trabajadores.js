const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([1])); // Solo superusuario

// Vista principal: muestra trabajadores y trabajos
router.get('/trabajadores', (req, res) => {
  const sqlTrabajadores = `
    SELECT u.id, u.nombre_apellido, u.sueldo, c.nombre AS cargo, t.nombre AS trabajo
    FROM inf_usuarios u
    JOIN cargo c ON u.id_cargo = c.id_cargo
    LEFT JOIN trabajos t ON u.id_trabajo = t.id_trabajo
    WHERE u.id_cargo = 3
  `;

  conexion.query(sqlTrabajadores, (err, listaTrabajadores) => {
    if (err) throw err;

    conexion.query('SELECT * FROM trabajos', (err2, listaTrabajos) => {
      if (err2) throw err2;

      res.render('super/trabajadores', {
        usuario: req.session.usuario,
        trabajadores: listaTrabajadores,
        trabajos: listaTrabajos
      });
    });
  });
});

// Asignar trabajo y sueldo a trabajador
router.post('/trabajadores/asignar', (req, res) => {
  const { id_usuario, id_trabajo, sueldo } = req.body;
  const sql = 'UPDATE inf_usuarios SET id_trabajo = ?, sueldo = ? WHERE id = ?';
  conexion.query(sql, [id_trabajo, sueldo, id_usuario], err => {
    if (err) throw err;
    res.redirect('/super/trabajadores');
  });
});

// Registrar nuevo trabajo
router.post('/trabajadores/registrarTrabajo', (req, res) => {
  const { nombre, descripcion } = req.body;
  const sql = 'INSERT INTO trabajos (nombre, descripcion) VALUES (?, ?)';
  conexion.query(sql, [nombre, descripcion], err => {
    if (err) throw err;
    res.redirect('/super/trabajadores');
  });
});

// Editar trabajo
router.post('/trabajadores/editarTrabajo', (req, res) => {
  const { id_trabajo, nombre, descripcion } = req.body;
  const sql = 'UPDATE trabajos SET nombre = ?, descripcion = ? WHERE id_trabajo = ?';
  conexion.query(sql, [nombre, descripcion, id_trabajo], err => {
    if (err) throw err;
    res.redirect('/super/trabajadores');
  });
});

// Eliminar trabajo
router.get('/trabajadores/eliminarTrabajo/:id', (req, res) => {
  const sql = 'DELETE FROM trabajos WHERE id_trabajo = ?';
  conexion.query(sql, [req.params.id], err => {
    if (err) return res.status(500).send('Error al eliminar');
    res.sendStatus(200);
  });
});

module.exports = router;
