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



// Eliminar una venta 
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log("ID recibido para eliminar:", id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    db.query("DELETE FROM ventas WHERE id=?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            console.log("No se encontró una venta con el ID:", id);
            return res.status(404).json({ error: "Venta no encontrada" });
        }

        res.json({ message: "Venta eliminada" });
    });
});
module.exports = router;