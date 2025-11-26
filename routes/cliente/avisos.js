const express = require('express');
const router = express.Router();
const conexion = require('../../config/conexion');
const link = require('../../config/link');

router.get('/users/avisos_users', function(req, res) {
    conexion.query('SELECT * FROM inf_usuarios', (err, resultados) => {
        if (err) throw err;
        res.render('users/avisos_users', {
            link,
            avisos: resultados
        });
    });
});

module.exports = router;