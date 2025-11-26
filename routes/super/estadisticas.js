const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion');

router.use(verificarCargo([1])); // Solo superusuario


router.get('/estadisticas', (req, res) => {
  const sql = `
    SELECT h.nombre AS hotel,
           DATE_FORMAT(p.fecha_pago, '%Y-%m') AS mes,
           SUM(p.monto) AS total_pagado
    FROM historial_pagos p
    JOIN hoteles h ON p.id_hotel = h.id_hotel
    GROUP BY h.id_hotel, mes
    ORDER BY mes DESC;
  `;

  conexion.query(sql, (err, estadisticas) => {
    if (err) throw err;
    res.locals.titulo = 'Estadísticas de Pagos';
    res.locals.icono = 'fa-chart-line';
    res.render('super/estadisticas', { estadisticas });
  });
});

module.exports = router;
