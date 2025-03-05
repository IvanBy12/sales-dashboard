import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar token
    navigate("/login"); // Redirigir al login
  };

  const [data, setData] = useState([]);
//crear una carpeta en C:\xampp\htdocs\ llamada "dashboard_api" y crea un archivo config.php para conectar MySQL:
  useEffect(() => {
    axios.get("http://localhost/dashboard_api/get_sales.php")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
   
    <div className="p-10">
         <h1>Bienvenido al Dashboard</h1>
         <button onClick={handleLogout}>Cerrar sesión</button>
      <h2 className="text-2xl font-bold mb-5">Ventas</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="sale_date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
