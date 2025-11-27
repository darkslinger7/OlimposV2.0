const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([1])); // Solo superusuario

// --- 1. LISTAR USUARIOS ---
router.get('/usuarios', (req, res) => {
  const sqlUsuarios = `
    SELECT u.*, h.nombre AS hotel_nombre, hab.numero AS habitacion_numero
    FROM inf_usuarios u
    LEFT JOIN hoteles h ON u.id_hotel = h.id_hotel
    LEFT JOIN habitaciones hab ON u.id_habitacion = hab.id_habitacion
    ORDER BY u.id DESC
  `;
  const sqlHoteles = 'SELECT id_hotel AS id, nombre FROM hoteles';
  const sqlHabitaciones = 'SELECT id_habitacion AS id, numero FROM habitaciones';

  conexion.query(sqlUsuarios, (err, usuarios) => {
    if (err) throw err;
    conexion.query(sqlHoteles, (err2, hoteles) => {
      if (err2) throw err2;
      conexion.query(sqlHabitaciones, (err3, habitaciones) => {
        if (err3) throw err3;

        res.render('super/usuarios', { 
            titulo: 'Gestión de Usuarios',
            icono: 'fa-users',
            usuarios, hoteles, habitaciones 
        });
      });
    });
  });
});

// --- 2. REGISTRAR USUARIO (Lógica Unificada) ---
router.post('/usuarios/registrar', (req, res) => {
  const { name, user, pass, email, telefono, cedula, cargo, hotel, habitacion } = req.body;
  const fecha = new Date().toLocaleDateString('es-ES');
  const fechaSQL = new Date().toISOString().split('T')[0];

  // 1. Insertar en inf_usuarios
  const sqlUser = `
    INSERT INTO inf_usuarios 
    (nombre_apellido, usuario, clave, email, telefono, cedula, id_cargo, id_hotel, id_habitacion, fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  // NOTA: Si 'hotel' o 'habitacion' vienen vacíos, enviamos NULL
  const valUser = [name, user, pass, email, telefono, cedula, cargo, hotel || null, habitacion || null, fecha];

  conexion.query(sqlUser, valUser, (err, result) => {
    if (err) {
        console.error("Error al registrar usuario:", err);
        return res.status(500).send("Error al crear usuario");
    }

    const idUsuario = result.insertId;

    // 2. Lógica para Roles Específicos
    if (cargo == 3) { // Trabajador
        const sqlTrab = "INSERT INTO trabajador (id_usuario, funcion, horario, salario, fecha_ingreso) VALUES (?, 'Sin asignar', '8am-4pm', 0, ?)";
        conexion.query(sqlTrab, [idUsuario, fechaSQL], (e) => { if(e) console.error(e); });
    } 
    else if (cargo == 4) { // Cliente
        const sqlCli = "INSERT INTO clientes (id_usuario, id_hotel, id_habitacion, fecha_registro) VALUES (?, ?, ?, ?)";
        conexion.query(sqlCli, [idUsuario, hotel || null, habitacion || null, fechaSQL], (e) => { if(e) console.error(e); });
    }

    res.redirect('/super/usuarios');
  });
});

// --- 3. EDITAR USUARIO ---
router.post('/usuarios/editar', (req, res) => {
    const { id_usuario, name, user, email, telefono, cedula, cargo, hotel, habitacion } = req.body;
    
    // Validamos si se envió contraseña nueva (si no, no la tocamos)
    let sqlUpdate = `
        UPDATE inf_usuarios 
        SET nombre_apellido=?, usuario=?, email=?, telefono=?, cedula=?, id_cargo=?, id_hotel=?, id_habitacion=?
    `;
    let valores = [name, user, email, telefono, cedula, cargo, hotel || null, habitacion || null];

    // Si el usuario escribió una contraseña nueva, la actualizamos también
    if (req.body.pass && req.body.pass.trim() !== "") {
        sqlUpdate += `, clave=?`;
        valores.push(req.body.pass);
    }

    sqlUpdate += ` WHERE id=?`;
    valores.push(id_usuario);

    conexion.query(sqlUpdate, valores, (err) => {
        if (err) {
            console.error("Error al editar:", err);
            return res.status(500).send("Error al actualizar");
        }
        res.redirect('/super/usuarios');
    });
});

// --- 4. ELIMINAR USUARIO ---
router.get('/eliminarUsuario/:id', (req, res) => {
  const id = req.params.id;
  // Gracias al ON DELETE CASCADE en tu BD, al borrar de inf_usuarios se borra de clientes/trabajador
  conexion.query('DELETE FROM inf_usuarios WHERE id = ?', [id], (err) => {
    if (err) {
        console.error(err);
        return res.status(500).send('Error al eliminar');
    }
    res.sendStatus(200);
  });
});

module.exports = router;