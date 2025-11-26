const express = require('express');
const router = express.Router();
const conexion = require('../../config/conexion');
const link = require('../../config/link');

router.get('/admin/avisos', function(req, res) {
    conexion.query('SELECT * FROM inf_usuarios', (err, resultados) => {
        if (err) throw err;
        res.render('trabajador/perfi', {
            link,
            avisos: resultados
        });
    });
});

module.exports = router;