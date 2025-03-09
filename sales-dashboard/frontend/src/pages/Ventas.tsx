import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

interface Venta {
  id: number;
  nombre: string;
  cantidad: number;
  total: number;
  fecha: string;
}

export default function Ventas() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // 🆕 Para redirigir al dashboard

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const productosRes = await axios.get("http://localhost:5000/api/productos");
      const ventasRes = await axios.get("http://localhost:5000/api/ventas");

      setProductos(productosRes.data);
      setVentas(ventasRes.data);
      setIsLoading(false);
    } catch (err) {
      setError("Error cargando datos");
      setIsLoading(false);
    }
  };

  

  const handleVenta = async () => {
    if (!productoId || !cantidad) {
      setError("Por favor complete todos los campos");
      return;
    }

    const producto = productos.find(p => p.id === parseInt(productoId));
    if (!producto) {
      setError("Selecciona un producto válido");
      return;
    }

    try {
      const cantidadNum = parseInt(cantidad);
      if (isNaN(cantidadNum) || cantidadNum <= 0) {
        setError("Ingrese una cantidad válida");
        return;
      }

      const total = producto.precio * cantidadNum;

      await axios.post("http://localhost:5000/api/ventas", {
        producto_id: productoId,
        cantidad: cantidadNum,
        total
      });

      await fetchData();
      setProductoId("");
      setCantidad("");
      setError("");
    } catch (err) {
      setError("Error al registrar la venta");
    }
  };

  const handleDeleteVenta = async (id: number) => {
    console.log("Intentando eliminar venta con ID:", id); // 🆕 Verificar que se está llamando
  try {
    setIsDeletingId(id);
    await axios.delete(`http://localhost:5000/api/ventas/${id}`);
    setVentas(ventas.filter((venta) => venta.id !== id));
    setIsDeletingId(null);
  } catch (err) {
    console.error("Error al eliminar la venta:", err);
    setError("Error al eliminar la venta");
    setIsDeletingId(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* 🔹 Botón para volver al dashboard */}
      <button 
        onClick={() => navigate("/dashboard")}
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        ← Volver al Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">Registrar Venta</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center p-4">Cargando...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Formulario de venta */}
          <div className="bg-white p-4 border rounded shadow">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Producto</label>
              <select 
                value={productoId} 
                onChange={(e) => setProductoId(e.target.value)} 
                className="w-full border p-2 rounded"
              >
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - ${typeof p.precio === 'number' ? p.precio.toFixed(2) : p.precio}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Cantidad</label>
              <input 
                type="number" 
                placeholder="Cantidad" 
                value={cantidad} 
                onChange={(e) => setCantidad(e.target.value)} 
                className="w-full border p-2 rounded"
              />
            </div>

            <button 
              onClick={handleVenta} 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Registrar Venta
            </button>
          </div>

          {/* Historial de ventas */}
          <div className="bg-white p-4 border rounded shadow">
            <h3 className="text-xl font-bold mb-4">Historial de Ventas</h3>

            {ventas.length === 0 ? (
              <p className="text-gray-500 text-center">No hay ventas registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Producto</th>
                      <th className="py-2 px-4 border-b text-left">Cantidad</th>
                      <th className="py-2 px-4 border-b text-left">Total</th>
                      <th className="py-2 px-4 border-b text-left">Fecha</th>
                      <th className="py-2 px-4 border-b text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{v.nombre}</td>
                        <td className="py-2 px-4 border-b">{v.cantidad}</td>
                        <td className="py-2 px-4 border-b">
                          ${typeof v.total === 'number' ? v.total.toFixed(2) : Number(v.total).toFixed(2)}
                        </td>
                        <td className="py-2 px-4 border-b">{new Date(v.fecha).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b">
                          <button 
                            onClick={() => handleDeleteVenta(v.id)} 
                            disabled={isDeletingId === v.id}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                          >
                            {isDeletingId === v.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
