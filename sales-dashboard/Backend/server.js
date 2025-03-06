const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productos");
const authRoutes = require("./routes/auth");
const app = express();
app.use(cors());


app.use(express.json());

// Importar rutas de autenticación
app.use("/api", authRoutes);
app.use("/api/productos", productRoutes);

app.listen(5000, () => console.log("🔥 Servidor corriendo en http://localhost:5000"));
