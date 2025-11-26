const link = require('../config/link');

function verificarCargo(permitidos) {
  return (req, res, next) => {
    const usuario = req.session?.usuario;

    if (!usuario) {
      // Si no hay sesión, redirige al login con mensaje
      return res.status(401).render('login', {
        mensaje: 'No autenticado. Por favor inicia sesión.',
        link
      });
    }

    if (permitidos.includes(usuario.id_cargo)) {
      return next();
    }

    // Si está autenticado pero no tiene permisos
    return res.status(403).render('error', {
      titulo: 'Acceso denegado',
      descripcion: 'No tienes permisos para acceder a esta sección.',
      usuario
    });
  };
}

module.exports = verificarCargo;
