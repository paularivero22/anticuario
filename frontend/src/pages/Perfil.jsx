import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './Perfil.css'
import { getImagenUrl } from '../utils/imagen'

// colores para el icono de estado de reservas y alquileres
const COLORES_ESTADO = {
  // Reservas
  solicitada: { color: '#C08552', bg: '#FDF6EF' },
  aceptada: { color: '#27ae60', bg: '#eafaf1' },
  cancelada: { color: '#c0392b', bg: '#fdf0ef' },
  completada: { color: '#2980b9', bg: '#eaf4fb' },
  expirada: { color: '#888', bg: '#f5f5f5' },
  // Alquileres
  solicitado: { color: '#C08552', bg: '#FDF6EF' },
  aceptado: { color: '#27ae60', bg: '#eafaf1' },
  cancelado: { color: '#c0392b', bg: '#fdf0ef' },
  recogido: { color: '#2f979e', bg: '#eaf8fb' },
  retrasado: { color: '#e67e22', bg: '#fef5e7' },
  completado: { color: '#2980b9', bg: '#eaf4fb' },
  expirado: { color: '#888', bg: '#f5f5f5' },
}

export default function Perfil() {
  const { usuario, actualizarUsuario } = useAuth()
  const navigate = useNavigate()
  const [seccion, setSeccion] = useState('datos')

  // Datos del perfil
  const [form, setForm] = useState({ name: '', email: '', telefono: '' })
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [datosOriginales, setDatosOriginales] = useState({ name: '', email: '', telefono: '' })

  // Contraseña
  const [formPassword, setFormPassword] = useState({ password_actual: '', password_nuevo: '', password_nuevo_confirmation: '' })
  const [guardandoPassword, setGuardandoPassword] = useState(false)
  const [exitoPassword, setExitoPassword] = useState('')
  const [errorPassword, setErrorPassword] = useState('')

  // Reservas
  const [reservas, setReservas] = useState([])
  const [cargandoReservas, setCargandoReservas] = useState(false)
  const [cancelandoReserva, setCelandoReserva] = useState(null)

  // Alquileres
  const [alquileres, setAlquileres] = useState([])
  const [cargandoAlquileres, setCargandoAlquileres] = useState(false)
  const [cancelandoAlquiler, setCancelandoAlquiler] = useState(null)

  const [recargarReservas, setRecargarReservas] = useState(0)
  const [recargarAlquileres, setRecargarAlquileres] = useState(0)

  // Redirigir si no está logueado
  useEffect(() => {
    if (!usuario) navigate('/login?redirect=/perfil')
  }, [usuario])

  // Cargar datos del perfil
  useEffect(() => {
    if (!usuario) return
    setCargando(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/perfil`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setForm({ name: data.name || '', email: data.email || '', telefono: data.telefono || '' })
        setDatosOriginales({ name: data.name || '', email: data.email || '', telefono: data.telefono || '' })
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [usuario])

  // Cargar reservas al entrar en la sección
  useEffect(() => {
    if (seccion !== 'reservas' || !usuario) return
    setCargandoReservas(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/perfil/reservas`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => { setReservas(data); setCargandoReservas(false) })
      .catch(() => setCargandoReservas(false))
  }, [seccion, recargarReservas])

  // Cargar alquileres al entrar en la sección
  useEffect(() => {
    if (seccion !== 'alquileres' || !usuario) return
    setCargandoAlquileres(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/perfil/alquileres`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => { setAlquileres(data); setCargandoAlquileres(false) })
      .catch(() => setCargandoAlquileres(false))
  }, [seccion, recargarAlquileres])

  // Manejar cambios en el formulario de datos del perfil
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setExito(''); setError('')
  }

  // Guardar cambios en el perfil
  const handleGuardar = async () => {
    setGuardando(true); setExito(''); setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/perfil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Error al guardar los cambios'); return }
      setForm({ name: data.user.name || '', email: data.user.email || '', telefono: data.user.telefono || '' })
      actualizarUsuario({ name: data.user.name, email: data.user.email, telefono: data.user.telefono })
      setExito('Datos actualizados correctamente')
      setEditando(false)
    } catch { setError('Error de conexión. Inténtalo de nuevo.') }
    finally { setGuardando(false) }
  }

  // Cancelar edición del perfil y volver a los datos originales
  const handleCancelar = () => {
    setEditando(false); setError(''); setExito('')
    setForm({ ...datosOriginales })
  }

  // Manejar cambio de contraseña
  const handleCambiarPassword = async () => {
    setGuardandoPassword(true); setExitoPassword(''); setErrorPassword('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/perfil/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formPassword)
      })
      const data = await res.json()
      if (!res.ok) { setErrorPassword(data.mensaje || 'Error al cambiar la contraseña'); return }
      setExitoPassword('Contraseña actualizada correctamente')
      setFormPassword({ password_actual: '', password_nuevo: '', password_nuevo_confirmation: '' })
    } catch { setErrorPassword('Error de conexión. Inténtalo de nuevo.') }
    finally { setGuardandoPassword(false) }
  }

  // Cancelar reserva
  const handleCancelarReserva = async (id) => {
    setCelandoReserva(id)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservas/${id}/cancelar`, {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (!res.ok) return
      setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: 'cancelada' } : r))
    } catch { }
    finally { setCelandoReserva(null) }
  }
  
  // Cancelar alquiler
  const handleCancelarAlquiler = async (id) => {
    setCancelandoAlquiler(id)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alquileres/${id}/cancelar`, {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (!res.ok) return
      setAlquileres(prev => prev.map(a => a.id === id ? { ...a, estado: 'cancelado' } : a))
    } catch { }
    finally { setCancelandoAlquiler(null) }
  }

  // Formatear fecha en formato dd/mm/yyyy
  const formatFecha = (fecha) => {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (!usuario) return null 

  return (
    <div className="perfil-page">

      {/* CABECERA */}
      <div className="perfil-cabecera">
        <h1 className="perfil-titulo">Mi cuenta</h1>
        <p className="perfil-subtitulo">{usuario.name} · {usuario.email}</p>
      </div>

      <div className="perfil-layout">

        {/* MENU LATERAL */}
        <aside className="perfil-sidebar">
          {/* Mis datos */}
          <button className={`perfil-nav-item ${seccion === 'datos' ? 'perfil-nav-activo' : ''}`} onClick={() => setSeccion('datos')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Mis datos
          </button>

          {/* Contraseña */}
          <button className={`perfil-nav-item ${seccion === 'password' ? 'perfil-nav-activo' : ''}`} onClick={() => setSeccion('password')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            Contraseña
          </button>

          {/* Reservas */}
          <button className={`perfil-nav-item ${seccion === 'reservas' ? 'perfil-nav-activo' : ''}`} onClick={() => setSeccion('reservas')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            Reservas
          </button>

          {/* Alquileres */}
          <button className={`perfil-nav-item ${seccion === 'alquileres' ? 'perfil-nav-activo' : ''}`} onClick={() => setSeccion('alquileres')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            Alquileres
          </button>
        </aside>

        {/* CONTENIDO */}
        <div className="perfil-contenido">

          {/* MIS DATOS */}
          {seccion === 'datos' && (
            <div className="perfil-seccion">
              <div className="perfil-avatar-row">
                <div className="perfil-avatar">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                <h2 className="perfil-nombre-grande">{usuario.name}</h2>
              </div>
              {cargando ? <p className="perfil-cargando">Cargando datos...</p> : (
                <>
                  <div className="perfil-form">
                    <div className="perfil-form-fila">
                      <div className="perfil-field">
                        <label className="perfil-label">Nombre de usuario</label>
                        <input className="perfil-input" type="text" name="name" value={form.name} onChange={handleChange} disabled={!editando} />
                      </div>
                      <div className="perfil-field">
                        <label className="perfil-label">Email</label>
                        <input className="perfil-input" type="email" name="email" value={form.email} onChange={handleChange} disabled={!editando} />
                      </div>
                    </div>
                    <div className="perfil-form-fila">
                      <div className="perfil-field">
                        <label className="perfil-label">Nº de teléfono</label>
                        <input className="perfil-input" type="tel" name="telefono" value={form.telefono} onChange={handleChange} disabled={!editando} placeholder="—" />
                      </div>
                    </div>
                  </div>
                  {exito && <p className="perfil-exito">{exito}</p>}
                  {error && <p className="perfil-error">{error}</p>}
                  <div className="perfil-botones">
                    {editando ? (
                      <>
                        <button className="btn-primary" onClick={handleGuardar} disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
                        <button className="btn-outline-dark" onClick={handleCancelar}>Cancelar</button>
                      </>
                    ) : (
                      <button className="btn-outline-dark" onClick={() => setEditando(true)}>Editar datos</button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* CONTRASEÑA */}
          {seccion === 'password' && (
            <div className="perfil-seccion">
              <h2 className="perfil-seccion-titulo">Cambiar contraseña</h2>
              <div className="perfil-form">
                {[
                  { label: 'Contraseña actual', key: 'password_actual', placeholder: '••••••••' },
                  { label: 'Nueva contraseña', key: 'password_nuevo', placeholder: 'Mínimo 8 caracteres' },
                  { label: 'Confirmar nueva contraseña', key: 'password_nuevo_confirmation', placeholder: 'Repite la contraseña' },
                ].map(({ label, key, placeholder }) => (
                  <div className="perfil-field" key={key}>
                    <label className="perfil-label">{label}</label>
                    <input className="perfil-input" type="password" value={formPassword[key]}
                      onChange={e => setFormPassword({ ...formPassword, [key]: e.target.value })} placeholder={placeholder} />
                  </div>
                ))}
              </div>
              {exitoPassword && <p className="perfil-exito">{exitoPassword}</p>}
              {errorPassword && <p className="perfil-error">{errorPassword}</p>}
              <div className="perfil-botones">
                <button className="btn-primary" onClick={handleCambiarPassword} disabled={guardandoPassword}>
                  {guardandoPassword ? 'Guardando...' : 'Cambiar contraseña'}
                </button>
              </div>
            </div>
          )}

          {/* RESERVAS */}
          {seccion === 'reservas' && (
            <div className="perfil-seccion">
              <div className="perfil-seccion-header">
                <h2 className="perfil-seccion-titulo">Mis reservas</h2>
                <button className="perfil-btn-recargar" onClick={() => setRecargarReservas(r => r + 1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                  Actualizar
                </button>
              </div>
              {cargandoReservas ? (
                <p className="perfil-cargando">Cargando reservas...</p>
              ) : reservas.length === 0 ? (
                <p className="perfil-vacio">No tienes reservas todavía.</p>
              ) : (
                <div className="perfil-lista">
                  {reservas.map((r, i) => {
                    const colores = COLORES_ESTADO[r.estado] || { color: '#888', bg: '#f5f5f5' }
                    return (
                      <div key={r.id} className="perfil-item">
                        <span className="perfil-item-num">{i + 1}</span>
                        <div className="perfil-item-img">
                          {r.producto?.imagen_principal?.url
                            ? <img src={getImagenUrl(r.producto.imagen_principal.url)} alt={r.producto?.nombre} />
                            : <div className="perfil-item-img-placeholder" />
                          }
                        </div>
                        <div className="perfil-item-info">
                          <Link to={`/producto/${r.producto_id}`} className="perfil-item-nombre">{r.producto?.nombre}</Link>
                          <p className="perfil-item-fecha">Recogida: {formatFecha(r.fecha_recogida)}</p>
                          <span className="perfil-item-estado" style={{ color: colores.color, background: colores.bg }}>
                            ● {r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}
                          </span>
                        </div>
                        {r.estado === 'solicitada' && (
                          <button
                            className="perfil-btn-cancelar"
                            onClick={() => handleCancelarReserva(r.id)}
                            disabled={cancelandoReserva === r.id}
                          >
                            {cancelandoReserva === r.id ? 'Cancelando...' : 'Cancelar'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ALQUILERES */}
          {seccion === 'alquileres' && (
            <div className="perfil-seccion">
              <div className="perfil-seccion-header">
                <h2 className="perfil-seccion-titulo">Mis alquileres</h2>
                <button className="perfil-btn-recargar" onClick={() => setRecargarAlquileres(a => a + 1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                  Actualizar
                </button>
              </div>
              {cargandoAlquileres ? (
                <p className="perfil-cargando">Cargando alquileres...</p>
              ) : alquileres.length === 0 ? (
                <p className="perfil-vacio">No tienes alquileres todavía.</p>
              ) : (
                <div className="perfil-lista">
                  {alquileres.map((a, i) => {
                    const colores = COLORES_ESTADO[a.estado] || { color: '#888', bg: '#f5f5f5' }
                    return (
                      <div key={a.id} className="perfil-item">
                        <span className="perfil-item-num">{i + 1}</span>
                        <div className="perfil-item-img">
                          {a.producto?.imagen_principal?.url
                            ? <img src={getImagenUrl(a.producto.imagen_principal.url)} alt={a.producto?.nombre} />
                            : <div className="perfil-item-img-placeholder" />
                          }
                        </div>
                        <div className="perfil-item-info">
                          <Link to={`/producto/${a.producto_id}`} className="perfil-item-nombre">{a.producto?.nombre}</Link>
                          <p className="perfil-item-fecha">
                            Recogida: {formatFecha(a.fecha_recogida)}
                            {a.fecha_devolucion && <> &nbsp;·&nbsp; Devolución: {formatFecha(a.fecha_devolucion)}</>}
                          </p>
                          <span className="perfil-item-estado" style={{ color: colores.color, background: colores.bg }}>
                            ● {a.estado.charAt(0).toUpperCase() + a.estado.slice(1)}
                          </span>
                        </div>
                        {a.estado === 'solicitado' && (
                          <button
                            className="perfil-btn-cancelar"
                            onClick={() => handleCancelarAlquiler(a.id)}
                            disabled={cancelandoAlquiler === a.id}
                          >
                            {cancelandoAlquiler === a.id ? 'Cancelando...' : 'Cancelar'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
