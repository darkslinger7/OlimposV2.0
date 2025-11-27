const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

// Middleware: Solo Administradores
router.use(verificarCargo([2]));

// --- 1. LISTAR HUÉSPEDES ---
router.get('/clientes', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;

    // Consulta A: Obtener lista de huéspedes actuales en este hotel
    const sqlClientes = `
        SELECT c.id_cliente, c.id_usuario, c.fecha_registro, 
               u.nombre_apellido, u.telefono, u.email, u.cedula,
               h.numero AS numero_habitacion, h.id_habitacion, h.tipo
        FROM clientes c
        JOIN inf_usuarios u ON c.id_usuario = u.id
        JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
        WHERE c.id_hotel = ?
        ORDER BY h.numero ASC
    `;

    // Consulta B: Obtener habitaciones DISPONIBLES (para poder mover gente)
    const sqlDisponibles = `
        SELECT id_habitacion, numero, tipo, precio 
        FROM habitaciones 
        WHERE id_hotel = ? AND estado = 'disponible'
    `;

    conexion.query(sqlClientes, [idHotel], (err, huespedes) => {
        if (err) throw err;

        conexion.query(sqlDisponibles, [idHotel], (err2, habitacionesLibres) => {
            if (err2) throw err2;

            res.render('administrador/clientes', {
                titulo: 'Gestión de Huéspedes',
                icono: 'fa-suitcase',
                usuario: req.session.usuario,
                huespedes,
                habitacionesLibres
            });
        });
    });
});

// --- 2. CAMBIAR DE HABITACIÓN (Mover Huésped) ---
router.post('/clientes/cambiar_habitacion', (req, res) => {
    const idHotel = req.session.usuario.id_hotel;
    const { id_cliente, id_usuario, id_habitacion_vieja, id_habitacion_nueva } = req.body;

    if (!id_habitacion_nueva) {
        return res.status(400).send("Debe seleccionar una habitación nueva.");
    }

    // PASO 1: Actualizar la tabla 'clientes'
    const sqlUpdateCliente = "UPDATE clientes SET id_habitacion = ? WHERE id_cliente = ?";
    
    // PASO 2: Actualizar la tabla 'inf_usuarios' (para mantener consistencia)
    const sqlUpdateUsuario = "UPDATE inf_usuarios SET id_habitacion = ? WHERE id = ?";

    // PASO 3: Liberar la habitación vieja
    const sqlLiberarVieja = "UPDATE habitaciones SET estado = 'disponible' WHERE id_habitacion = ?";

    // PASO 4: Ocupar la habitación nueva
    const sqlOcuparNueva = "UPDATE habitaciones SET estado = 'ocupada' WHERE id_habitacion = ?";

    // Ejecutamos en cadena (Lo ideal sería una transacción, pero usaremos callbacks anidados por simplicidad)
    conexion.query(sqlUpdateCliente, [id_habitacion_nueva, id_cliente], err => {
        if (err) throw err;
        
        conexion.query(sqlUpdateUsuario, [id_habitacion_nueva, id_usuario], err2 => {
            if (err2) throw err2;

            conexion.query(sqlLiberarVieja, [id_habitacion_vieja], err3 => {
                if (err3) throw err3;

                conexion.query(sqlOcuparNueva, [id_habitacion_nueva], err4 => {
                    if (err4) throw err4;
                    res.redirect('/administrador/clientes');
                });
            });
        });
    });
});

// --- 3. CHECK-OUT (Salida del Huésped) ---
router.get('/clientes/checkout/:idCliente/:idHabitacion/:idUsuario', (req, res) => {
    const { idCliente, idHabitacion, idUsuario } = req.params;

    // 1. Eliminar de la tabla 'clientes' (o podrías moverlo a un historial de 'estancias_finalizadas')
    const sqlDeleteCliente = "DELETE FROM clientes WHERE id_cliente = ?";

    // 2. Desvincular habitación en 'inf_usuarios'
    const sqlUpdateUsuario = "UPDATE inf_usuarios SET id_habitacion = NULL WHERE id = ?";

    // 3. Liberar la habitación
    const sqlLiberarHabitacion = "UPDATE habitaciones SET estado = 'disponible' WHERE id_habitacion = ?";

    conexion.query(sqlDeleteCliente, [idCliente], err => {
        if (err) throw err;

        conexion.query(sqlUpdateUsuario, [idUsuario], err2 => {
            if (err2) throw err2;

            conexion.query(sqlLiberarHabitacion, [idHabitacion], err3 => {
                if (err3) throw err3;
                res.redirect('/administrador/clientes');
            });
        });
    });
});

module.exports = router;