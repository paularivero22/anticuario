import { useState, useEffect } from "react";
import './Home.css';
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate()

  // obtener productos destacados
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/productos/destacados`)
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al cargar productos destacados:', err);
        setCargando(false);
      });
  }, []);

  return (
    <div className="main">

      {/* Cabecera */}
      <div className="home-header">
        <div className="text-center">
          <p className="header-subtitle">Antigüedades Mortera</p>
          <h1 className="header-title">Piezas únicas<br />con historia</h1>
          <div className="header-buttons">
            <button className="btn-primary" onClick={() => navigate('/catalogo')}>Ver catálogo</button>
            <button className="btn-secondary" onClick={() => navigate('/sobre-nosotros')}>Sobre nosotros</button>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="info-cards-container">
        <div className="info-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
          <div>
            <p className="info-card-title">Reservas y Alquileres</p>
            <p className="info-card-text">Reserva o alquila un producto desde la web.<br />Paga y recoge en persona.</p>
            <div className="info-card-links">
              {/* <span className="link-underline">Guía de Reservas</span>
              <span className="link-underline">Guía de Alquileres</span> */}
            </div>
          </div>
        </div>

        <div className="info-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          <div>
            <p className="info-card-title">Horarios de la tienda</p>
            <p className="info-card-text">Sábados 9:00 - 14:00<br />Apertura entre semana con previa llamada</p>
            <span className="link-underline" onClick={() => navigate('/contacto')}>Contacto</span>
          </div>
        </div>

        <div className="info-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
          <div>
            <p className="info-card-title">Ubicación</p>
            <p className="info-card-text">Antigüedades Mortera, Calle...<br />Mortera, Cantabria</p>
            <span className="link-underline link-underline-mt">Ver en Google Maps</span>
          </div>
        </div>
      </div>

      {/* Destacados */}
      <div className="destacados-section">
        <h2 className="section-title">Destacados</h2>
        <div className="productos-grid">
          {productos.map(p => (
            <div key={p.id} className="producto-card" onClick={() => navigate(`/producto/${p.id}`)}>
              <div className="producto-img-wrapper">
                {p.imagen_principal ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${p.imagen_principal.url}`}
                    alt={p.nombre}
                    className="producto-img"
                  />
                ) : (
                  <div className="producto-img" />
                )}
              </div>
              <p className="producto-nombre">{p.nombre}</p>
              <p className="producto-precio">{p.precio}€</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <button className="btn-primary" onClick={() => navigate('/catalogo')}>Ver Todos</button>
        </div>
      </div>

      {/* Sobre nosotros */}
      <div className="sobre-nosotros-wrapper">
        <div className="sobre-nosotros-section">
          <div className="sobre-nosotros-grid">
            <div>
              <p className="section-eyebrow">Nuestra historia</p>
              <h2 className="sobre-nosotros-title">40 años de historia</h2>
              <p className="sobre-nosotros-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae pellentesque magna, et mattis mi. Phasellus et consectetur felis. Cras sit amet hendrerit massa. Nam euismod augue non accumsan maximus.
              </p>
              <button className="btn-primary" onClick={() => navigate('/sobre-nosotros')}>Sobre nosotros</button>
            </div>
            <div className="sobre-nosotros-img"></div>
          </div>
        </div>
      </div>

    </div>
  );
}
