import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './ProductoDetalle.css'

export default function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  // Estados principales de los datos del producto y su carga
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [imagenActual, setImagenActual] = useState(0)
  const [masProductos, setMasProductos] = useState([])
  const [medidasAbierto, setMedidasAbierto] = useState(false)
  const [materialesAbierto, setMaterialesAbierto] = useState(false)
  const [lightboxAbierto, setLightboxAbierto] = useState(false) // lightbox es la galería de imágenes en grande

  // Modal reserva
  const [modalReserva, setModalReserva] = useState(false)
  const [fechaRecogida, setFechaRecogida] = useState('')
  const [prefiereLlamada, setPrefiereLlamada] = useState(false)
  const [reservando, setReservando] = useState(false)
  const [reservaExito, setReservaExito] = useState(false)
  const [reservaError, setReservaError] = useState('')

  // Modal alquiler
  const [modalAlquiler, setModalAlquiler] = useState(false)
  const [fechaRecogidaAlquiler, setFechaRecogidaAlquiler] = useState('')
  const [fechaDevolucion, setFechaDevolucion] = useState('')
  const [prefiereLlamadaAlquiler, setPrefiereLlamadaAlquiler] = useState(false)
  const [alquilando, setAlquilando] = useState(false)
  const [alquilerExito, setAlquilerExito] = useState(false)
  const [alquilerError, setAlquilerError] = useState('')

  // Modal no logueado
  const [modalNoAuth, setModalNoAuth] = useState(false)

  // Cargar producto al montar el componente o al cambiar el ID
  useEffect(() => {
    setCargando(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`)
      .then(res => res.json())
      .then(data => {
        setProducto(data)
        setImagenActual(0)
        setCargando(false)
        if (data.subcategoria?.categoria_id) {
          fetch(`${import.meta.env.VITE_API_URL}/api/productos?categoria_id=${data.subcategoria.categoria_id}`)
            .then(res => res.json())
            .then(productos => {
              const otros = productos.filter(p => p.id !== data.id)
              const aleatorios = otros.sort(() => Math.random() - 0.5).slice(0, 4)
              setMasProductos(aleatorios)
            })
        }
      })
      .catch(err => {
        console.error('Error al cargar producto:', err)
        setCargando(false)
      })
  }, [id])

  // Manejar navegación con teclado en el lightbox
  useEffect(() => {
    if (!producto) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxAbierto(false)
        setModalReserva(false)
        setModalAlquiler(false)
        setModalNoAuth(false)
      }
      if (e.key === 'ArrowLeft') setImagenActual(prev => prev === 0 ? producto.imagenes.length - 1 : prev - 1)
      if (e.key === 'ArrowRight') setImagenActual(prev => prev === producto.imagenes.length - 1 ? 0 : prev + 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [producto, imagenActual, lightboxAbierto])

  // Funciones para cambiar imagen en galería
  const imagenAnterior = () => {
    setImagenActual(prev => prev === 0 ? producto.imagenes.length - 1 : prev - 1)
  }

  const imagenSiguiente = () => {
    setImagenActual(prev => prev === producto.imagenes.length - 1 ? 0 : prev + 1)
  }

  // Funciones para manejar reservas y alquileres, mostrando modales según el estado de autenticación del usuario
  const handleReservar = () => {
    if (!usuario) {
      setModalNoAuth(true)
    } else {
      setReservaExito(false)
      setReservaError('')
      setFechaRecogida('')
      setPrefiereLlamada(false)
      setModalReserva(true)
    }
  }

  // Confirmar reserva enviando datos al backend y manejando estados de éxito o error
  const confirmarReserva = async () => {
    setReservando(true)
    setReservaError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          producto_id: producto.id,
          fecha_recogida: prefiereLlamada ? null : fechaRecogida || null,
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setReservaError(data.message || 'Error al realizar la reserva')
        return
      }
      setReservaExito(true)
    } catch (err) {
      setReservaError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setReservando(false)
    }
  }

  // Cerrar modal de reserva y limpiar estados relacionados
  const cerrarModalReserva = () => {
    setModalReserva(false)
    setReservaExito(false)
    setReservaError('')
  }

  // Manejar alquiler, mostrando modal de alquiler o de no autenticado según corresponda
  const handleAlquilar = () => {
    if (!usuario) {
      setModalNoAuth(true)
    } else {
      setAlquilerExito(false)
      setAlquilerError('')
      setFechaRecogidaAlquiler('')
      setFechaDevolucion('')
      setPrefiereLlamadaAlquiler(false)
      setModalAlquiler(true)
    }
  }

  // Confirmar alquiler enviando datos al backend y manejando estados de éxito o error
  const confirmarAlquiler = async () => {
    setAlquilando(true)
    setAlquilerError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alquileres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          producto_id: producto.id,
          fecha_recogida: prefiereLlamadaAlquiler ? null : fechaRecogidaAlquiler || null,
          fecha_devolucion: prefiereLlamadaAlquiler ? null : fechaDevolucion || null,
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setAlquilerError(data.message || 'Error al realizar el alquiler')
        return
      }
      setAlquilerExito(true)
    } catch (err) {
      setAlquilerError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setAlquilando(false)
    }
  }

  // Cerrar modal de alquiler y limpiar estados relacionados
  const cerrarModalAlquiler = () => {
    setModalAlquiler(false)
    setAlquilerExito(false)
    setAlquilerError('')
  }

  // Calcular días totales de alquiler para mostrar en el modal
  const calcularDias = () => {
    if (!fechaRecogidaAlquiler || !fechaDevolucion) return null
    const inicio = new Date(fechaRecogidaAlquiler)
    const fin = new Date(fechaDevolucion)
    const diff = Math.round((fin - inicio) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : null
  }
  const diasAlquiler = calcularDias()

  // Estados cargando o de error
  if (cargando) return <div className="detalle-cargando">Cargando producto...</div>
  if (!producto) return <div className="detalle-cargando">Producto no encontrado.</div>

  // Fecha mínima: mañana
  const hoy = new Date()
  hoy.setDate(hoy.getDate() + 1)
  const fechaMin = hoy.toISOString().split('T')[0]

  return (
    <div className="detalle-page">

      {/* ===== MODAL NO LOGUEADO ===== */}
      {modalNoAuth && (
        <div className="modal-overlay" onClick={() => setModalNoAuth(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setModalNoAuth(false)}>✕</button>
            <div className="modal-noauth-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5E3023" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 className="modal-titulo">Inicia sesión para reservar</h2>
            <p className="modal-texto">Necesitas una cuenta para poder realizar una reserva.</p>
            <div className="modal-noauth-botones">
              <Link to={`/login?redirect=/producto/${id}`} className="btn-primary modal-noauth-btn" onClick={() => setModalNoAuth(false)}>
                Iniciar sesión
              </Link>
              <Link to="/registro" className="btn-outline-dark modal-noauth-btn" onClick={() => setModalNoAuth(false)}>
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL RESERVA ===== */}
      {modalReserva && (
        <div className="modal-overlay" onClick={cerrarModalReserva}>
          <div className="modal-card modal-reserva-card" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModalReserva}>✕</button>

            {reservaExito ? (
              <div className="modal-exito">
                <div className="modal-exito-icon">✓</div>
                <h2 className="modal-titulo">¡Reserva solicitada!</h2>
                <p className="modal-texto">Tu reserva ha sido enviada correctamente. Nos pondremos en contacto contigo para confirmarla.</p>
                <button className="btn-primary" onClick={cerrarModalReserva}>
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <h2 className="modal-titulo">Tu reserva</h2>

                <div className="modal-producto-info">
                  {producto.imagenes && producto.imagenes.length > 0 && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${producto.imagenes[0]?.url}`}
                      alt={producto.nombre}
                      className="modal-producto-img"
                    />
                  )}
                  <div className="modal-producto-datos">
                    <p className="modal-producto-nombre">{producto.nombre}</p>
                    <p className="modal-producto-precio">{producto.precio}€</p>
                    <p className="modal-producto-desc">{producto.descripcion}</p>
                    <p className="modal-producto-cantidad">Cantidad: 1</p>
                  </div>
                </div>

                <div className="modal-divider" />

                <div className="modal-campo">
                  <label className="modal-label">Día de recogida</label>
                  <div className="modal-form">
                    <input
                      type="date"
                      className="modal-reserva-input"
                      value={fechaRecogida}
                      min={fechaMin}
                      onChange={e => setFechaRecogida(e.target.value)}
                      disabled={prefiereLlamada}
                    />
                    <div className="modal-checkbox">
                      <label className="modal-checkbox-label">
                        <input
                          type="checkbox"
                          checked={prefiereLlamada}
                          onChange={e => setPrefiereLlamada(e.target.checked)}
                        />
                        <span>Prefiero ponerme en contacto con la tienda</span>
                      </label>
                      {prefiereLlamada && (
                        <p className="modal-telefono">Telf: 123 45 67 89</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-divider" />

                <div className="modal-como-funciona">
                  <p className="modal-como-titulo">¿Cómo funciona?</p>
                  <p className="modal-como-paso">→ Haces una reserva</p>
                  <p className="modal-como-paso">→ Tu reserva es aceptada o cancelada</p>
                  <p className="modal-como-paso">→ Pagas y recoges en persona en la fecha señalada</p>
                  <p className="modal-como-paso">→ ¡Compra completada!</p>
                </div>

                {reservaError && <p className="modal-error">{reservaError}</p>}

                <div className="modal-botones">
                  <button
                    className="btn-primary modal-btn"
                    onClick={confirmarReserva}
                    disabled={reservando}
                  >
                    {reservando ? 'Reservando...' : 'Confirmar reserva'}
                  </button>
                  <button className="btn-outline-dark modal-btn" onClick={cerrarModalReserva}>
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== MODAL ALQUILER ===== */}
      {modalAlquiler && (
        <div className="modal-overlay" onClick={cerrarModalAlquiler}>
          <div className="modal-card modal-reserva-card" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModalAlquiler}>✕</button>

            {alquilerExito ? (
              <div className="modal-exito">
                <div className="modal-exito-icon">✓</div>
                <h2 className="modal-titulo">¡Alquiler solicitado!</h2>
                <p className="modal-texto">Tu alquiler ha sido enviado correctamente. Nos pondremos en contacto contigo para confirmarlo.</p>
                <button className="btn-primary" onClick={cerrarModalAlquiler}>
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <h2 className="modal-titulo">Tu alquiler</h2>

                <div className="modal-producto-info">
                  {producto.imagenes && producto.imagenes.length > 0 && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${producto.imagenes[0]?.url}`}
                      alt={producto.nombre}
                      className="modal-producto-img"
                    />
                  )}
                  <div className="modal-producto-datos">
                    <p className="modal-producto-nombre">{producto.nombre}</p>
                    <p className="modal-producto-precio">{producto.precio}€</p>
                    <p className="modal-producto-desc">{producto.descripcion}</p>
                    <p className="modal-producto-cantidad">Cantidad: 1</p>
                  </div>
                </div>

                <div className="modal-divider" />

                <div className="modal-campo">
                  <div className="modal-form">
                    <div className="campos-alquiler">
                      <div>
                        <label className="modal-label">Día de recogida</label>
                        <input
                          type="date"
                          className="modal-alquiler-input"
                          value={fechaRecogidaAlquiler}
                          min={fechaMin}
                          onChange={e => setFechaRecogidaAlquiler(e.target.value)}
                          disabled={prefiereLlamadaAlquiler}
                        />
                      </div>
                      <div>
                        <label className="modal-label">Día de devolución</label>
                        <input
                          type="date"
                          className="modal-alquiler-input"
                          value={fechaDevolucion}
                          min={fechaRecogidaAlquiler || fechaMin}
                          onChange={e => setFechaDevolucion(e.target.value)}
                          disabled={prefiereLlamadaAlquiler || !fechaRecogidaAlquiler}
                        />
                      </div>
                    </div>
                    <div className="modal-checkbox">
                      <label className="modal-checkbox-label">
                        <input
                          type="checkbox"
                          checked={prefiereLlamadaAlquiler}
                          onChange={e => setPrefiereLlamadaAlquiler(e.target.checked)}
                        />
                        <span>Prefiero ponerme en contacto con la tienda</span>
                      </label>
                      {prefiereLlamadaAlquiler && (
                        <p className="modal-telefono">Telf: 123 45 67 89</p>
                      )}
                    </div>
                  </div>
                  {diasAlquiler && (
                    <p className="modal-dias-total">Días totales: <strong>{diasAlquiler}</strong></p>
                  )}
                </div>

                <div className="modal-divider" />

                <div className="modal-como-funciona">
                  <p className="modal-como-titulo">¿Cómo funciona?</p>
                  <p className="modal-como-paso">→ Haces una solicitud de alquiler</p>
                  <p className="modal-como-paso">→ Tu alquiler es aceptado o cancelado</p>
                  <p className="modal-como-paso">→ Pagas y recoges en persona en la fecha señalada</p>
                  <p className="modal-como-paso">→ Devuelves el artículo en la fecha señalada</p>
                  <p className="modal-como-paso">→ ¡Alquiler completado!</p>
                </div>

                {alquilerError && <p className="modal-error">{alquilerError}</p>}

                <div className="modal-botones">
                  <button
                    className="btn-primary modal-btn"
                    onClick={confirmarAlquiler}
                    disabled={alquilando}
                  >
                    {alquilando ? 'Solicitando...' : 'Confirmar alquiler'}
                  </button>
                  <button className="btn-outline-dark modal-btn" onClick={cerrarModalAlquiler}>
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== LIGHTBOX ===== */}
      {lightboxAbierto && (
        <div className="lightbox-overlay" onClick={() => setLightboxAbierto(false)}>
          <button className="lightbox-cerrar" onClick={() => setLightboxAbierto(false)}>✕</button>
          <div className="lightbox-contenido" onClick={e => e.stopPropagation()}>
            <img
              src={`${import.meta.env.VITE_API_URL}${producto.imagenes[imagenActual]?.url}`}
              alt={producto.nombre}
              className="lightbox-img"
            />
            {producto.imagenes.length > 1 && (
              <>
                <button className="lightbox-btn lightbox-btn-prev" onClick={imagenAnterior}>‹</button>
                <button className="lightbox-btn lightbox-btn-next" onClick={imagenSiguiente}>›</button>
              </>
            )}
            <p className="lightbox-contador">{imagenActual + 1} / {producto.imagenes.length}</p>
          </div>
        </div>
      )}

      {/* Migas de pan */}
      <div className="detalle-breadcrumb">
        <Link to="/">Inicio</Link>
        <span className="breadcrumb-separador">›</span>
        <Link to={`/productos/${producto.subcategoria?.categoria_id}`}>
          {producto.subcategoria?.categoria?.nombre}
        </Link>
        <span className="breadcrumb-separador">›</span>
        <span className="breadcrumb-actual">{producto.nombre}</span>
      </div>

      {/* Detalle principal */}
      <div className="detalle-main">

        {/* Galería */}
        <div className="detalle-galeria">
          <div className="detalle-imagen-principal">
            {producto.imagenes && producto.imagenes.length > 0 ? (
              <>
                <img
                  src={`${import.meta.env.VITE_API_URL}${producto.imagenes[imagenActual]?.url}`}
                  alt={producto.nombre}
                  className="detalle-img"
                />
                <button className="galeria-zoom-btn" onClick={() => setLightboxAbierto(true)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="detalle-img-placeholder" />
            )}
            {producto.imagenes && producto.imagenes.length > 1 && (
              <>
                <button className="galeria-btn galeria-btn-prev" onClick={imagenAnterior}>‹</button>
                <button className="galeria-btn galeria-btn-next" onClick={imagenSiguiente}>›</button>
              </>
            )}
          </div>

          {producto.imagenes && producto.imagenes.length > 1 && (
            <div className="detalle-miniaturas">
              {producto.imagenes.map((img, index) => (
                <div
                  key={img.id}
                  className={`detalle-miniatura ${imagenActual === index ? 'miniatura-activa' : ''}`}
                  onClick={() => setImagenActual(index)}
                >
                  <img src={`${import.meta.env.VITE_API_URL}${img.url}`} alt={`${producto.nombre} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info producto */}
        <div className="detalle-info">
          <h1 className="detalle-nombre">{producto.nombre}</h1>
          <p className="detalle-precio">{producto.precio}€</p>
          <p className="detalle-descripcion">{producto.descripcion}</p>

          <div className="detalle-acordeones">
            {producto.medidas && (
              <div className="acordeon-group">
                <div className="acordeon-header" onClick={() => setMedidasAbierto(!medidasAbierto)}>
                  <div className="acordeon-header-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
                    <span>Medidas</span>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={medidasAbierto ? 'chevron-up' : ''}>
                    <path d="M2 4l4 4 4-4" stroke="#5E3023" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                {medidasAbierto && <div className="acordeon-content"><p>{producto.medidas}</p></div>}
              </div>
            )}
            {producto.materiales && (
              <div className="acordeon-group">
                <div className="acordeon-header" onClick={() => setMaterialesAbierto(!materialesAbierto)}>
                  <div className="acordeon-header-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                    <span>Materiales</span>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={materialesAbierto ? 'chevron-up' : ''}>
                    <path d="M2 4l4 4 4-4" stroke="#5E3023" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                {materialesAbierto && <div className="acordeon-content"><p>{producto.materiales}</p></div>}
              </div>
            )}
          </div>

          <div className="detalle-botones">
            {producto.estado === 'alquilado' ? (
              <div className="detalle-alquilado-aviso">
                <p className="detalle-alquilado-texto">
                  Este producto está actualmente alquilado.{' '}
                  <Link to="/sobre-nosotros" className="detalle-alquilado-link">
                    Contacta con nosotros
                  </Link>
                  {' '}para más información.
                </p>
                <div className="detalle-botones-disabled">
                  {!!producto.permite_reserva && (
                    <button className="btn-primary detalle-btn" disabled>Reservar</button>
                  )}
                  {producto.permite_alquiler == 1 && (
                    <button className="btn-outline-dark detalle-btn" disabled>Alquilar</button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {!!producto.permite_reserva && (
                  <button className="btn-primary detalle-btn" onClick={handleReservar}>Reservar</button>
                )}
                {producto.permite_alquiler == 1 && (
                  <button className="btn-outline-dark detalle-btn" onClick={handleAlquilar}>Alquilar</button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Más productos */}
      {masProductos.length > 0 && (
        <div className="detalle-mas-productos">
          <h2 className="section-title">Más Productos</h2>
          <div className="mas-productos-grid">
            {masProductos.map(p => (
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
        </div>
      )}
    </div>
  )
}
