const express = require("express");
const router = express.Router();
const db = require("../db"); // Importamos la conexión a MySQL

router.get("/", (req, res) => {
    db.query("SELECT ventas.*, productos.nombre FROM ventas JOIN productos ON ventas.producto_id = productos.id", 
    (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


router.post("/", (req, res) => {
    const { producto_id, cantidad, total } = req.body;
    const query = "INSERT INTO ventas (producto_id, cantidad, total) VALUES (?, ?, ?)";
    db.query(query, [producto_id, cantidad, total], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Venta registrada", venta_id: result.insertId });
    });
});

module.exports = router;