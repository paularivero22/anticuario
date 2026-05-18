import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Productos.css'

export default function Productos() {
  const { categoriaId } = useParams()
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [subcategorias, setSubcategorias] = useState([])
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [epocas, setEpocas] = useState([])
  const [paises, setPaises] = useState([])
  const [cargando, setCargando] = useState(true)

  const [subcategoriasFiltro, setSubcategoriasFiltro] = useState([])
  const [epocasFiltro, setEpocasFiltro] = useState([])
  const [paisesFiltro, setPaisesFiltro] = useState([])
  const [orden, setOrden] = useState('')

  const [filtroAbierto, setFiltroAbierto] = useState(null)
  const [filtroMovilAbierto, setFiltroMovilAbierto] = useState(false)

  const totalFiltros = subcategoriasFiltro.length + epocasFiltro.length + paisesFiltro.length // Contar el total de filtros aplicados para mostrar en el botón móvil

  // Opciones de ordenado para el select de ordenar por
  const opcionesOrden = [
    { value: 'precio_asc', label: 'Precio, menor a mayor' },
    { value: 'precio_desc', label: 'Precio, mayor a menor' },
    { value: 'nombre_asc', label: 'Alfabéticamente, a-z' },
    { value: 'nombre_desc', label: 'Alfabéticamente, z-a' },
  ]

  // Imágenes principales de cada categoría
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

  // Función para abrir/cerrar selects de filtros y ordenado
  const toggleFiltro = (nombre) => {
    setFiltroAbierto(filtroAbierto === nombre ? null : nombre)
  }

  // Función para manejar selección de filtros, agregando o quitando el valor de la lista correspondiente
  const toggleCheck = (valor, lista, setLista) => {
    if (lista.includes(valor)) {
      setLista(lista.filter(v => v !== valor))
    } else {
      setLista([...lista, valor])
    }
  }

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setSubcategoriasFiltro([])
    setEpocasFiltro([])
    setPaisesFiltro([])
  }

  // Cargar datos cada vez que cambia la categoría seleccionada, reseteando estados relacionados y mostrando cargando
  useEffect(() => {
    setNombreCategoria('')
    setSubcategorias([])
    setProductos([])
    setSubcategoriasFiltro([])
    setEpocasFiltro([])
    setPaisesFiltro([])
    setCargando(true)
  }, [categoriaId])

  // Cargar épocas y países al montar el componente
  useEffect(() => {
    fetch('http://localhost:8000/api/epocas')
      .then(res => res.json())
      .then(data => setEpocas(data))
      .catch(err => console.error('Error al cargar épocas:', err))

    fetch('http://localhost:8000/api/paises')
      .then(res => res.json())
      .then(data => setPaises(data))
      .catch(err => console.error('Error al cargar países:', err))
  }, [])

  // Cargar subcategorías y nombre de la categoría cada vez que cambia la categoría seleccionada
  useEffect(() => {
    fetch('http://localhost:8000/api/categorias')
      .then(res => res.json())
      .then(data => {
        const cat = data.find(c => c.id == categoriaId)
        if (cat) setNombreCategoria(cat.nombre)
      })

    fetch(`http://localhost:8000/api/subcategorias?categoria_id=${categoriaId}`)
      .then(res => res.json())
      .then(subs => setSubcategorias(subs))
      .catch(err => console.error('Error al cargar subcategorías:', err))
  }, [categoriaId])

  useEffect(() => {
    setCargando(true)
    let url = `http://localhost:8000/api/productos?categoria_id=${categoriaId}`
    if (orden) url += `&orden=${orden}`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProductos(data)
        setCargando(false)
      })
      .catch(err => {
        console.error('Error al cargar productos:', err)
        setCargando(false)
      })
  }, [categoriaId, orden])

  // Filtrar productos según los filtros seleccionados
  const productosFiltrados = productos
    .filter(p => subcategoriasFiltro.length === 0 || subcategoriasFiltro.includes(p.subcategoria_id))
    .filter(p => epocasFiltro.length === 0 || epocasFiltro.includes(p.epoca_id))
    .filter(p => paisesFiltro.length === 0 || paisesFiltro.includes(p.pais_id))

  // Panel de filtros (compartido entre pantalla grande y móvil)
  const panelFiltros = (
    <>
      <div className="filtro-group">
        <div className="filtro-header" onClick={() => toggleFiltro('subcategoria')}>
          <span>Categoría {subcategoriasFiltro.length > 0 && <span className="filtro-count">({subcategoriasFiltro.length})</span>}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={filtroAbierto === 'subcategoria' ? 'chevron-up' : ''}>
            <path d="M2 4l4 4 4-4" stroke="#5E3023" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        {filtroAbierto === 'subcategoria' && (
          <div className="filtro-dropdown">
            {subcategorias.map(s => (
              <label key={s.id} className="filtro-checkbox-label">
                <input type="checkbox" className="filtro-checkbox" checked={subcategoriasFiltro.includes(s.id)} onChange={() => toggleCheck(s.id, subcategoriasFiltro, setSubcategoriasFiltro)} />
                <span>{s.nombre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filtro-group">
        <div className="filtro-header" onClick={() => toggleFiltro('epoca')}>
          <span>Época {epocasFiltro.length > 0 && <span className="filtro-count">({epocasFiltro.length})</span>}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={filtroAbierto === 'epoca' ? 'chevron-up' : ''}>
            <path d="M2 4l4 4 4-4" stroke="#5E3023" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        {filtroAbierto === 'epoca' && (
          <div className="filtro-dropdown">
            {epocas.map(e => (
              <label key={e.id} className="filtro-checkbox-label">
                <input type="checkbox" className="filtro-checkbox" checked={epocasFiltro.includes(e.id)} onChange={() => toggleCheck(e.id, epocasFiltro, setEpocasFiltro)} />
                <span>{e.nombre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filtro-group">
        <div className="filtro-header" onClick={() => toggleFiltro('pais')}>
          <span>País de Origen {paisesFiltro.length > 0 && <span className="filtro-count">({paisesFiltro.length})</span>}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={filtroAbierto === 'pais' ? 'chevron-up' : ''}>
            <path d="M2 4l4 4 4-4" stroke="#5E3023" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        {filtroAbierto === 'pais' && (
          <div className="filtro-dropdown">
            {paises.map(p => (
              <label key={p.id} className="filtro-checkbox-label">
                <input type="checkbox" className="filtro-checkbox" checked={paisesFiltro.includes(p.id)} onChange={() => toggleCheck(p.id, paisesFiltro, setPaisesFiltro)} />
                <span>{p.nombre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {totalFiltros > 0 && (
        <button className="filtros-limpiar-btn" onClick={limpiarFiltros}>Limpiar filtros</button>
      )}
    </>
  )

  return (
    <div className="productos-page">

      {/* Cabecera */}
      <div
        className="categoria-header"
        style={{ backgroundImage: `url(${imagenesCategorias[categoriaId] || '/imagenes/foto-header.jpg'})` }}
      >
        {nombreCategoria ? (
          <h1 className="categoria-titulo">{nombreCategoria}</h1>
        ) : (
          <div className="categoria-titulo-placeholder" />
        )}
      </div>

      {/* Botón filtrar móvil */}
      <div className="filtrar-movil-bar">
        <button className="filtrar-movil-btn" onClick={() => setFiltroMovilAbierto(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filtrar y ordenar
          {totalFiltros > 0 && <span className="filtrar-movil-count">({totalFiltros})</span>}
        </button>
      </div>

      {/* Panel filtros móvil */}
      {filtroMovilAbierto && (
        <div className="filtro-movil-overlay" onClick={() => setFiltroMovilAbierto(false)} />
      )}
      <div className={`filtro-movil-panel ${filtroMovilAbierto ? 'filtro-movil-panel-abierto' : ''}`}>
        <div className="filtro-movil-header">
          <span className="filtro-movil-titulo">Filtrar y ordenar</span>
          <button className="filtro-movil-cerrar" onClick={() => setFiltroMovilAbierto(false)}>✕</button>
        </div>
        <div className="filtro-movil-contenido">
          {/* Ordenar por en móvil */}
          <div className="filtro-group">
            <div className="filtro-header" onClick={() => toggleFiltro('orden-movil')}>
              <span>Ordenar por</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={filtroAbierto === 'orden-movil' ? 'chevron-up' : ''}>
                <path d="M2 4l4 4 4-4" stroke="#5E3023" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            {filtroAbierto === 'orden-movil' && (
              <div className="filtro-dropdown">
                {opcionesOrden.map(op => (
                  <div key={op.value} className={`ordenar-option ${orden === op.value ? 'filtro-option-activo' : ''}`} onClick={() => { setOrden(op.value); setFiltroAbierto(null) }}>
                    {op.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          {panelFiltros}
        </div>
        <div className="filtro-movil-footer">
          <button className="btn-primary" onClick={() => setFiltroMovilAbierto(false)}>
            Ver {productosFiltrados.length} productos
          </button>
        </div>
      </div>

      <div className="productos-layout">

        {/* Sidebar filtros pantalla grande */}
        <aside className="filtros-sidebar">
          <p className="filtros-titulo">Filtros</p>
          {panelFiltros}
        </aside>

        {/* Contenido productos */}
        <div className="productos-contenido">

          {/* Ordenar por pantalla grande */}
          <div className="ordenar-wrapper">
            <div className="ordenar-btn" onClick={() => toggleFiltro('orden')}>
              {orden ? opcionesOrden.find(o => o.value === orden)?.label : 'ORDENAR POR'}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={filtroAbierto === 'orden' ? 'chevron-up' : ''}>
                <path d="M2 4l4 4 4-4" stroke="#5E3023" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            {filtroAbierto === 'orden' && (
              <div className="ordenar-dropdown">
                {opcionesOrden.map(op => (
                  <div key={op.value} className={`ordenar-option ${orden === op.value ? 'filtro-option-activo' : ''}`} onClick={() => { setOrden(op.value); setFiltroAbierto(null) }}>
                    {op.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {cargando ? (
            <p className="cargando-text">Cargando productos...</p>
          ) : productosFiltrados.length === 0 ? (
            <p className="cargando-text">No hay productos disponibles.</p>
          ) : (
            <div className="productos-grid">
              {productosFiltrados.map(p => (
                <div key={p.id} className="producto-card" onClick={() => navigate(`/producto/${p.id}`)}>
                  <div className="producto-img-wrapper">
                    {p.imagen_principal ? (
                      <img
                        src={`http://localhost:8000${p.imagen_principal.url}`}
                        alt={p.nombre}
                        className="producto-img"
                        loading="lazy"
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
          )}
        </div>
      </div>
    </div>
  )
}
