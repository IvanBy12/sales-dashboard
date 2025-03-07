import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Definir el tipo de datos de la base de datos
type Sale = {
  id: number;
  sale_date: string;
  price: number;
  product_name: string;
  customer_name: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");

  // Cargar datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sales");
        setData(response.data);
      } catch (error) {
        console.error("❌ Error al obtener los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para formatear la fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleDateString("es-ES");
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Navigation handler
  const navigateTo = (path: string, menuItem: string) => {
    setActiveMenuItem(menuItem);
    navigate(path);
  };

  // Calcular resumen de ventas
  const totalVentas = data.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const promedioVentas = data.length > 0 ? totalVentas / data.length : 0;

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      {/* Mobile Menu Toggle */}
      <div className="d-md-none bg-dark p-2 text-white d-flex justify-content-between align-items-center">
        <h3 className="m-0">Sistema de Ventas</h3>
        <button className="btn btn-outline-light" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`bg-dark text-white p-0 ${isMobileMenuOpen ? 'd-block' : 'd-none d-md-block'}`} style={{ width: "250px", height: "100%", position: "sticky", top: 0 }}>
        <div className="p-3 border-bottom border-secondary">
          <h3 className="text-center mb-0">Sistema de Ventas</h3>
        </div>
        <div className="p-3">
          <ul className="list-unstyled">
            <li className="mb-2">
              <button className={`btn ${activeMenuItem === 'dashboard' ? 'btn-primary' : 'btn-outline-light'} w-100 text-start`} onClick={() => navigateTo("/dashboard", 'dashboard')}>
                📊 Dashboard
              </button>
            </li>
            <li className="mb-2">
              <button className={`btn ${activeMenuItem === 'productos' ? 'btn-primary' : 'btn-outline-light'} w-100 text-start`} onClick={() => navigateTo("/productos", 'productos')}>
                📦 Productos
              </button>
            </li>
            <li className="mb-2">
              <button className={`btn ${activeMenuItem === 'ventas' ? 'btn-primary' : 'btn-outline-light'} w-100 text-start`} onClick={() => navigateTo("/ventas", 'ventas')}>
                🛒 Ventas
              </button>
            </li>
            <li>
              <button className="btn btn-outline-danger w-100 text-start" onClick={handleLogout}>
                🔒 Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <div className="p-4">
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <h2 className="mb-4">📊 Dashboard de Ventas</h2>
            
            {isLoading ? (
              <p className="text-center">Cargando datos...</p>
            ) : data.length === 0 ? (
              <p className="text-center text-muted">No hay datos de ventas disponibles</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="sale_date" stroke="#666" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#007bff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="bg-white rounded shadow-sm p-4">
                <h4>Ventas Recientes</h4>
                {data.length === 0 ? (
                  <p className="text-muted">No hay ventas recientes</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Cliente</th>
                        <th>Importe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 5).map((item) => (
                        <tr key={item.id}>
                          <td>{formatDate(item.sale_date)}</td>
                          <td>{item.product_name}</td>
                          <td>{item.customer_name}</td>
                          <td>${Number(item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="bg-white rounded shadow-sm p-4">
                <h4>Resumen de Ventas</h4>
                <p><strong>Total Ventas:</strong> ${totalVentas.toFixed(2)}</p>
                <p><strong>Promedio:</strong> ${promedioVentas.toFixed(2)}</p>
                <p><strong>Ventas Registradas:</strong> {data.length}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
