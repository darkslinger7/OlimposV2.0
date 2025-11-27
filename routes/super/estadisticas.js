const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([1])); // Solo superusuario

router.get('/estadisticas', (req, res) => {
  // CONSULTA FINANCIERA AVANZADA
  // Calculamos ingresos y egresos por hotel usando subconsultas
  const sql = `
    SELECT 
        h.id_hotel,
        h.nombre AS hotel,
        COALESCE(ing.total_ingresos, 0) AS ingresos,
        COALESCE(egr.total_egresos, 0) AS egresos,
        (COALESCE(ing.total_ingresos, 0) - COALESCE(egr.total_egresos, 0)) AS ganancia_neta
    FROM hoteles h
    -- Subconsulta para INGRESOS (Pagos de clientes vinculados por cédula)
    LEFT JOIN (
        SELECT u.id_hotel, SUM(p.monto_pago) as total_ingresos
        FROM pagos p
        JOIN inf_usuarios u ON p.cedula = u.cedula
        GROUP BY u.id_hotel
    ) ing ON h.id_hotel = ing.id_hotel
    -- Subconsulta para EGRESOS (Pagos a administradores)
    LEFT JOIN (
        SELECT id_hotel, SUM(monto) as total_egresos
        FROM historial_pagos
        GROUP BY id_hotel
    ) egr ON h.id_hotel = egr.id_hotel
    ORDER BY ganancia_neta DESC;
  `;

  conexion.query(sql, (err, estadisticas) => {
    if (err) throw err;

    // --- CALCULAR TOTALES GLOBALES (Esto es lo que faltaba) ---
    let totalIngresos = 0;
    let totalEgresos = 0;
    
    // Recorremos cada hotel para sumar al total general
    estadisticas.forEach(e => {
        totalIngresos += parseFloat(e.ingresos);
        totalEgresos += parseFloat(e.egresos);
    });

    let totalGanancia = totalIngresos - totalEgresos;

    // Renderizamos enviando 'globales'
    res.render('super/estadisticas', {
        titulo: 'Reporte Financiero',
        icono: 'fa-chart-pie',
        usuario: req.session.usuario || { nombre: 'Super Admin' },
        estadisticas,
        globales: { totalIngresos, totalEgresos, totalGanancia } // <--- ¡AQUÍ ESTÁ LA SOLUCIÓN!
    });
  });
});

module.exports = router;