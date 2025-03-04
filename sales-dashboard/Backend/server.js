const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas de autenticación
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

app.listen(5000, () => console.log("🔥 Servidor corriendo en http://localhost:5000"));
