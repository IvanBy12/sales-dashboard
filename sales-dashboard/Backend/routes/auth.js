const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Importamos la conexión a MySQL

const router = express.Router();

// 📌 Ruta para registrar usuarios 
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error en el servidor", error: err });
    }
    res.status(201).json({ message: "Usuario registrado correctamente" });
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
