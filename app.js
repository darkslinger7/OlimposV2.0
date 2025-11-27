// IMPORTAR LIBRERÍAS
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// CONFIGURACIONES GENERALES
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CONFIGURACIÓN DE LA SESIÓN
app.use(session({
  secret: 'mi-clave-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 
  }
}));
// ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, 'public')));

// RUTAS DE AUTENTICACIÓN
app.use(require('./routes/login'));
app.use(require('./routes/codLogin'));
app.use(require('./routes/recuperar'));
app.use(require('./routes/registro_publico'));

// RUTAS DE SUPERUSUARIO
const superMiddleware = require('./middlewares/super');
const superRoutes = require('./routes/super');

app.use('/super', superMiddleware, superRoutes);
app.use('/super', require('./routes/super/dashboard'));
app.use('/super', require('./routes/super/usuarios'));
app.use('/super', require('./routes/super/estadisticas'));
app.use('/super', require('./routes/super/pagos'));
app.use('/super', require('./routes/super/hoteles'));
app.use('/super', require('./routes/super/habitaciones'));
app.use('/super', require('./routes/super/trabajadores'));
app.use('/super', require('./routes/super/avisos'));
app.use('/super', require('./routes/super/gestion_hotel'));

// ADMINISTRADOR 
app.use('/administrador', require('./routes/administrador/dashboard'));
app.use('/administrador', require('./routes/administrador/habitaciones'));
app.use('/administrador', require('./routes/administrador/trabajadores'));
app.use('/administrador', require('./routes/administrador/clientes'));
app.use('/administrador', require('./routes/administrador/pagos'));
app.use('/administrador', require('./routes/administrador/avisos'));
app.use('/administrador', require('./routes/administrador/estadisticas'));

// TRABAJADOR 
app.use('/trabajador', require('./routes/trabajador/dashboard'));
app.use('/trabajador', require('./routes/trabajador/tareas'));
app.use('/trabajador', require('./routes/trabajador/avisos'));
app.use('/trabajador', require('./routes/trabajador/perfil'));
app.use('/trabajador', require('./routes/trabajador/pagos'));

// RUTAS DE HOTEL
app.use('/hotel', require('./routes/hotel/hoteles'));
app.use('/hotel', require('./routes/hotel/habitaciones'));

// RUTAS DE CLIENTE
app.use('/cliente', require('./routes/cliente/dashboard'));
app.use('/cliente', require('./routes/cliente/avisos'));
app.use('/cliente', require('./routes/cliente/habitacion'));
app.use('/cliente', require('./routes/cliente/pagos'));
app.use('/cliente', require('./routes/cliente/perfil'));



// PUERTO DEL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
