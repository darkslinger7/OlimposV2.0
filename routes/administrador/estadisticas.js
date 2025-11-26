const express = require('express');
const router = express.Router();
const conexion = require('../../config/conexion');
const link = require('../../config/link');

router.get('/admin/estadisticas', function(req, res) {
    // Primero obtener los pagos
    conexion.query('SELECT * FROM pagos', (err, pagos) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al cargar los pagos');
        }
        
        // Luego obtener los usuarios
        conexion.query('SELECT * FROM inf_usuarios', (err, usuarios) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al cargar los usuarios');
            }
            conexion.query('SELECT * FROM pagosMesualidad',(err, estan)=>{
                if(err){
                    console.log(err)
                    return res.status(500).send('Error en la cargaa de Estadisticas');
                }
                // Renderizar la vista con ambos conjuntos de datos
                res.render('admin/estadisticas', {
                    link: link,
                    results: pagos,
                    usuarios: usuarios ,
                    estan: estan
                });
            });
        });
    });
});

module.exports = router;