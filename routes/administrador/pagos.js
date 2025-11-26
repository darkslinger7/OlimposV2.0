const express = require('express');
const router = express.Router();
const conexion = require('../../config/conexion');
const link = require('../../config/link');

router.get('/admin/pagos', function(req, res) {
    conexion.query('SELECT * FROM pagos', (err, resultados) => {
        if (err) throw err;
        res.render('admin/pagos', {link, pagos: resultados});
    });
});

module.exports = router;