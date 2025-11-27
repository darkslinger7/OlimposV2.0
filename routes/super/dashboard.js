const express = require('express');
const router = express.Router();
const verificarCargo = require('../../middlewares/verificarCargo');
const conexion = require('../../config/conexion'); // Importante: necesitamos la conexión a la BD

router.use(verificarCargo([1])); 

router.get('/dashboard', (req, res) => {
  // 1. Contar cuántos HOTELES hay
  conexion.query('SELECT COUNT(*) as total FROM hoteles', (err, resHoteles) => {
    if (err) throw err;

    // 2. Contar cuántas HABITACIONES hay
    conexion.query('SELECT COUNT(*) as total FROM habitaciones', (err2, resHabitaciones) => {
      if (err2) throw err2;

      // 3. Contar USUARIOS agrupados por rol (para separar trabajadores)
      conexion.query('SELECT id_cargo, COUNT(*) as total FROM inf_usuarios GROUP BY id_cargo', (err3, resUsuarios) => {
        if (err3) throw err3;

        // Inicializamos el objeto stats con los datos obtenidos
        let stats = {
            hoteles: resHoteles[0].total,
            habitaciones: resHabitaciones[0].total,
            trabajadores: 0, // Valor inicial
            usuarios: 0      // Valor inicial
        };

        // Recorremos los resultados de usuarios para sumar totales
        resUsuarios.forEach(row => {
            stats.usuarios += row.total; // Sumamos al total general
            if (row.id_cargo === 3) {    // Si el cargo es 3, son trabajadores
                stats.trabajadores = row.total;
            }
        });

        // 4. Renderizamos la vista enviando "stats" (¡Esto es lo que faltaba!)
        res.render('super/dashboard', {
            titulo: 'Panel Principal',
            icono: 'fa-home',
            usuario: req.session.usuario || { nombre: 'Super Admin' },
            stats // <--- Aquí pasamos el objeto que pide tu vista
        });
      });
    });
  });
});

module.exports = router;