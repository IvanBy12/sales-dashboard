import { useEffect, useState } from "react";
import axios from "axios";

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

  // 🔹 Cargar productos desde el backend
  const fetchProductos = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/productos");
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 🔹 Agregar un nuevo producto
  const handleAgregar = async () => {
    try {
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
    } catch (error) {
      console.error("Error al agregar producto", error);
    }
  };

  return (
    <div className="container">
      <h2>Gestión de Productos</h2>

      {/* 🔹 Formulario para agregar productos */}
      <div className="formulario">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />
        <button onClick={handleAgregar}>Agregar Producto</button>
      </div>

      {/* 🔹 Tabla de productos */}
      <table border="1">
        <thead>
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
              <td>${producto.precio.toFixed(2)}</td>
              <td>
                <img src={producto.imagen} alt={producto.nombre} width="50" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
