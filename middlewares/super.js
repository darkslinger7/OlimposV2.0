module.exports = (req, res, next) => {
  res.locals.usuario = req.session.usuario;

  if (typeof res.locals.titulo === 'undefined') {
    res.locals.titulo = 'Panel Super';
  }
  if (typeof res.locals.icono === 'undefined') {
    res.locals.icono = 'fa-home';
  }

  next();
};
