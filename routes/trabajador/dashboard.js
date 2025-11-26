const express = require('express');
const router = express.Router();
const link = require('../../config/link');

router.get("/admin", function(req, res) {
  if (!req.session || !req.session.login || !req.session.usuario) {
    return res.render("login", { mensaje: "Por favor, inicia sesión.", link });
  }

console.log("¿Usuario en sesión?", req.session.usuario);


  res.render("admin", {
    usuario: req.session.usuario,
    link
  });
});

router.get('/admin/registro', (req, res) => {
  if (!req.session.login) {
    return res.render('login', { mensaje: "Inicia sesión", link });
  }

  res.sendFile(path.join(__dirname, '../public/admin/registro.html'));
});

module.exports = router;
