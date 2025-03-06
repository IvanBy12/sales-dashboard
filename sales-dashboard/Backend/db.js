const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Cambia esto si usas otra cuenta
  password: "", // Si XAMPP no tiene contraseña, déjalo vacío
  database: "login", // Pon el nombre de tu base de datos
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

module.exports = db;
