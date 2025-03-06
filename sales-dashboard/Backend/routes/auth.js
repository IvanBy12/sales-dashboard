const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Importamos la conexión a MySQL

const router = express.Router();

// 📌 Ruta para registrar usuarios 
router.post("/register", async (req, res) => {
  const { nombre, descripcion, precio, imagen } = req.body;

  if (!nombre || !descripcion || !precio || !imagen) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const query = "INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)";
  db.query(query, [nombre, descripcion, precio, imagen], (err, result) => {
      if (err) {
          return res.status(500).json({ message: "Error en la base de datos", error: err });
      }
      res.status(201).json({ message: "Producto agregado", id: result.insertId });
  });
});


// 📌 Ruta para iniciar sesión
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ email: user.email }, "secreto", { expiresIn: "1h" });
    res.json({ token });
  });
});



module.exports = router;
