import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost/dashboard_api/get_sales.php")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error al obtener datos de ventas:", err));
  }, []);

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="d-flex">
      {/* 🔹 Menú lateral */}
      <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
        <h3 className="text-center">Menú</h3>
        <ul className="list-unstyled">
          <li className="p-2">
            <button className="btn btn-outline-light w-100" onClick={() => navigate("/productos")}>
              📦 Gestionar Productos
            </button>
          </li>
          <li className="p-2">
            <button className="btn btn-outline-light w-100" onClick={() => navigate("/ventas")}>
              💰 Ver Ventas
            </button>
          </li>
          <li className="p-2">
            <button className="btn btn-danger w-100" onClick={handleLogout}>
              ❌ Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>

      {/* 🔹 Contenido Principal */}
      <div className="p-4 w-100">
        <h2>📊 Dashboard de Ventas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="sale_date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#007bff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
