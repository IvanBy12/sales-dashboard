const express = require("express");
const db = require("../db"); // Importar conexión a MySQL
const router = express.Router();

// Obtener todos los productos
router.get("/", (req, res) => {
    db.query("SELECT * FROM productos", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Crear un producto
router.post("/", (req, res) => {
    const { nombre, descripcion, precio, imagen } = req.body;
    db.query(
        "INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)",
        [nombre, descripcion, precio, imagen],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Producto creado", id: result.insertId });
        }
    );
});

// Actualizar un producto
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen } = req.body;
    db.query(
        "UPDATE productos SET nombre=?, descripcion=?, precio=?, imagen=? WHERE id=?",
        [nombre, descripcion, precio, imagen, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Producto actualizado" });
        }
    );
});

// Eliminar un producto
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM productos WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Producto eliminado" });
    });
});

module.exports = router;
