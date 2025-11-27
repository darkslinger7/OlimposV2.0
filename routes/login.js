const express = require('express');
const router = express.Router();
const link = require('../config/link');

// Ruta para mostrar el formulario de login
router.get("/login", function(req, res) {
    // Si ya está logueado, lo mandamos a su dashboard según su rol (opcional, pero recomendado)
    if (req.session.login) {
        if (req.session.usuario.id_cargo === 1) return res.redirect('/super/dashboard');
        if (req.session.usuario.id_cargo === 2) return res.redirect('/administrador/dashboard');
    }
    res.render("login", { linkLogin: link.linkLogin });
});

// Ruta raíz (por si entran a localhost:3000/)
router.get("/", function(req, res) {
    res.redirect("/login");
});

// --- RUTA DE SALIDA (LOGOUT) ---
router.get("/login/salir", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;