const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([1])); // Solo superusuario

// --- VISTA PRINCIPAL DE PAGOS ---
router.get('/pagos', (req, res) => {
  // 1. CONSULTA DE PAGOS PENDIENTES (Lógica de Negocio)
  // Buscamos a los Administradores (cargo 2) y sumamos los sueldos de los trabajadores (cargo 3) de su mismo hotel
  const sqlCalculoPagos = `
    SELECT 
        h.id_hotel,
        h.nombre AS hotel_nombre,
        admin.id AS id_admin,
        admin.nombre_apellido AS admin_nombre,
        admin.sueldo AS sueldo_admin,
        (
            SELECT COALESCE(SUM(u.sueldo), 0) 
            FROM inf_usuarios u 
            WHERE u.id_hotel = h.id_hotel AND u.id_cargo = 3
        ) AS gastos_nomina
    FROM hoteles h
    JOIN inf_usuarios admin ON h.id_hotel = admin.id_hotel
    WHERE admin.id_cargo = 2
  `;

  // 2. CONSULTA DE HISTORIAL (Últimos 10 pagos realizados)
  const sqlHistorial = `
    SELECT hp.*, h.nombre as hotel_nombre, u.nombre_apellido as admin_nombre
    FROM historial_pagos hp
    JOIN hoteles h ON hp.id_hotel = h.id_hotel
    JOIN inf_usuarios u ON hp.id_admin = u.id
    ORDER BY hp.fecha_pago DESC
    LIMIT 10
  `;

  conexion.query(sqlCalculoPagos, (err, pagosPendientes) => {
    if (err) throw err;

    conexion.query(sqlHistorial, (err2, historial) => {
      if (err2) throw err2;

      // Calculamos el total (Admin + Nómina) para cada fila antes de enviarlo a la vista
      // Si sueldo_admin o gastos_nomina son nulos, usamos 0
      pagosPendientes = pagosPendientes.map(p => ({
          ...p,
          total_a_pagar: (parseFloat(p.sueldo_admin) || 0) + (parseFloat(p.gastos_nomina) || 0)
      }));

      // AQUI ENVIAMOS 'pagosPendientes' A LA VISTA
      res.render('super/pagos', {
        titulo: 'Finanzas y Pagos',
        icono: 'fa-money-check-alt',
        usuario: req.session.usuario || { nombre: 'Super Admin' },
        pagosPendientes, // <--- ¡Esto es lo que faltaba!
        historial
      });
    });
  });
});

// --- REGISTRAR UN PAGO REALIZADO ---
router.post('/pagos/registrar', (req, res) => {
  const { id_hotel, id_admin, monto } = req.body;
  
  // Insertamos en la tabla historial_pagos
  const sql = `INSERT INTO historial_pagos (id_hotel, id_admin, monto, fecha_pago) VALUES (?, ?, ?, NOW())`;
  
  conexion.query(sql, [id_hotel, id_admin, monto], (err) => {
    if (err) {
        console.error(err);
        return res.status(500).send("Error al registrar el pago");
    }
    res.redirect('/super/pagos');
  });
});

module.exports = router;