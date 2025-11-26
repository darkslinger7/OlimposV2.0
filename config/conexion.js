const mysql = require("mysql");


const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234", 
  database: "convivir_bd",
  port: 3306 
});

conexion.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con MySQL local:", err.message);
    return;
  }
  console.log("Conexión exitosa a MySQL ");
});

module.exports = conexion;
