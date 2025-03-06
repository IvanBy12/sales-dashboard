import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  // 🔹 Cargar productos desde el backend
  const fetchProductos = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/productos");
      const productosConvertidos = data.map((producto: any) => ({
        ...producto,
        precio: Number(producto.precio),
      }));
      setProductos(productosConvertidos);
    } catch (error) {
      console.error("Error al obtener productos", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 🔹 Agregar un nuevo producto
  const handleAgregar = async () => {
    if (!nombre || !descripcion || !precio || !imagen) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/productos", {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        imagen,
      });

      fetchProductos(); // Recargar productos después de agregar
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setImagen("");
      setMensaje("Producto agregado correctamente");
    } catch (error) {
      console.error("Error al agregar producto", error);
      setMensaje("Error al agregar producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      {/* 🔹 Botón para regresar al Dashboard */}
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/dashboard")}>
        ← Volver al Dashboard
      </button>


      <h2 className="text-center mb-4">Gestión de Productos</h2>

      {/* 🔹 Mensaje de estado */}
      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      {/* 🔹 Formulario para agregar productos */}
      <div className="card p-4 shadow mb-4">
        <h4 className="mb-3">Agregar Nuevo Producto</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingrese el nombre"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ingrese la descripción"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Precio</label>
            <input
              type="number"
              className="form-control"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Ingrese el precio"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">URL de la imagen</label>
            <input
              type="text"
              className="form-control"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="Ingrese la URL de la imagen"
            />
          </div>
        </div>

        <button className="btn btn-primary w-100" onClick={handleAgregar} disabled={loading}>
          {loading ? "Agregando..." : "Agregar Producto"}
        </button>
      </div>

      {/* 🔹 Tabla de productos */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Imagen</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${Number(producto.precio).toFixed(2)}</td>
                <td>
                  <img src={producto.imagen} alt={producto.nombre} width="50" className="img-thumbnail" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
