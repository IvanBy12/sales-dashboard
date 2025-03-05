import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 👈 Hook para redirigir

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    setLoading(true);
    setError("");

    console.log("Enviando datos:", { email, password }); // 🔍 Verifica qué se envía

    try {
      const { data } = await axios.post("http://localhost:5000/api/login", { email, password });
      console.log("Respuesta del servidor:", data);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
      alert("Inicio de sesión exitoso");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
      console.error("Error en la solicitud:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow border-0" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="card-body p-4 p-sm-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Iniciar Sesión</h2>
            <p className="text-muted">Ingresa tus credenciales para acceder</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <div className="input-group mb-3">
                <span className="input-group-text bg-light">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control py-2"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@ejemplo.com"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <a href="#" className="text-decoration-none small">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text bg-light">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control py-2"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
              </div>
            </div>

            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Recordar mis datos
              </label>
            </div>
            
            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary py-2 fw-bold" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Cargando...
                  </>
                ) : "Iniciar sesión"}
              </button>
            </div>
            
            {error && (
              <div className="alert alert-danger d-flex align-items-center mt-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{error}</div>
              </div>
            )}
            
            <div className="text-center mt-4">
              <p className="mb-0">
                ¿No tienes una cuenta? <a href="#" className="text-decoration-none fw-bold">Regístrate</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}