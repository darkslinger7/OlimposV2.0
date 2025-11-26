const express = require('express');
const router = express.Router();
const link = require('../../config/link');

router.get("/users", function(req, res) {
    if (!req.session || !req.session.login) {
        return res.render("login", { mensaje: "Por favor, inicia sesión.", link });
    }

    res.render("users", { datos: req.session, link });
});

module.exports = router;
