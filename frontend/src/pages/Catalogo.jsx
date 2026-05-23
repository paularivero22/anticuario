import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Catalogo.css'

// imagenes principales de cada categoría (id de categoría => url imagen)
const imagenesCategorias = {
  1: '/imagenes/categorias/muebles.webp',
  2: '/imagenes/categorias/decoracion.webp',
  3: '/imagenes/categorias/iluminacion.webp',
  4: '/imagenes/categorias/vajilla.webp',
  5: '/imagenes/categorias/figuras.webp',
  6: '/imagenes/categorias/arte.webp',
  7: '/imagenes/categorias/joyeria.webp',
  8: '/imagenes/categorias/coleccionismo.webp',
}

export default function Catalogo() {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  // cargar categorías 
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categorias`)
      .then(res => res.json())
      .then(data => {
        setCategorias(data)
        setCargando(false)
      })
      .catch(err => {
        console.error('Error al cargar categorías:', err)
        setCargando(false)
      })
  }, [])

  return (
    <div className="catalogo-page">
      <div className="catalogo-cabecera">
        <p className="catalogo-eyebrow">Antigüedades Mortera</p>
        <h1 className="catalogo-titulo">Explora nuestros productos</h1>
      </div>

      {cargando ? (
        <p className="catalogo-cargando">Cargando categorías...</p>
      ) : (
        <div className="catalogo-grid">
          {categorias.map(cat => (
            <div
              key={cat.id}
              className="catalogo-card"
              onClick={() => navigate(`/productos/${cat.id}`)}
            >
              <div className="catalogo-img-wrapper">
                {imagenesCategorias[cat.id] ? (
                  <img
                    src={imagenesCategorias[cat.id]}
                    alt={cat.nombre}
                    className="catalogo-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="catalogo-img-placeholder" />
                )}
              </div>
              <p className="catalogo-nombre">{cat.nombre}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
