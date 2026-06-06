import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

const token = () => localStorage.getItem('token')
const headers = () => ({
  'Authorization': `Bearer ${token()}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
})

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

const formatFecha = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ===== SECCION CATEGORIAS =====
function SeccionCategorias() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nuevaCategoria, setNuevaCategoria] = useState('')
  const [editandoCategoria, setEditandoCategoria] = useState(null)
  const [nombreEditCategoria, setNombreEditCategoria] = useState('')
  const [nuevaSub, setNuevaSub] = useState({})
  const [editandoSub, setEditandoSub] = useState(null)
  const [nombreEditSub, setNombreEditSub] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [categoriasFiltradas, setCategoriasFiltradas] = useState(null)
  const [ordenCat, setOrdenCat] = useState('nombre-asc')

  // Carga todas las categorías con sus subcategorías desde el backend
  const cargar = () => {
    setCargando(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/categorias`, { headers: headers() })
      .then(r => r.json())
      .then(d => { setCategorias(d); setCargando(false) })
      .catch(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  // Ordena la lista de categorías (filtrada o completa) según el criterio seleccionado:
  // nombre-asc/desc: alfabéticamente, fecha-asc/desc: por fecha de creación
  const categoriasOrdenadas = [...(categoriasFiltradas || categorias)].sort((a, b) => {
    if (ordenCat === 'nombre-asc') return a.nombre.localeCompare(b.nombre)
    if (ordenCat === 'nombre-desc') return b.nombre.localeCompare(a.nombre)
    if (ordenCat === 'fecha-desc') return new Date(b.created_at) - new Date(a.created_at)
    if (ordenCat === 'fecha-asc') return new Date(a.created_at) - new Date(b.created_at)
    return 0
  })

  // Muestra un mensaje de éxito o error durante 3 segundos y luego lo limpia
  const msg = (ok, txt) => { ok ? setExito(txt) : setError(txt); setTimeout(() => { setExito(''); setError('') }, 3000) }

  // Crea una nueva categoría con el nombre introducido y recarga la lista
  const crearCategoria = async () => {
    if (!nuevaCategoria.trim()) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/categorias`, { method: 'POST', headers: headers(), body: JSON.stringify({ nombre: nuevaCategoria }) })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al crear categoría')
    setNuevaCategoria(''); cargar(); msg(true, 'Categoría creada')
  }


  // Guarda el nuevo nombre de una categoría que se está editando
  const guardarCategoria = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/categorias/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify({ nombre: nombreEditCategoria }) })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al actualizar')
    setEditandoCategoria(null); cargar(); msg(true, 'Categoría actualizada')
  }

  // Elimina una categoría tras confirmación del usuario y recarga la lista
  const eliminarCategoria = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/categorias/${id}`, { method: 'DELETE', headers: headers() })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al eliminar')
    cargar(); msg(true, 'Categoría eliminada')
  }

  // Crea una nueva subcategoría dentro de la categoría indicada por categoriaId
  const crearSub = async (categoriaId) => {
    const nombre = nuevaSub[categoriaId] || ''
    if (!nombre.trim()) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/subcategorias`, { method: 'POST', headers: headers(), body: JSON.stringify({ nombre, categoria_id: categoriaId }) })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al crear subcategoría')
    setNuevaSub({ ...nuevaSub, [categoriaId]: '' }); cargar(); msg(true, 'Subcategoría creada')
  }

  // Guarda el nuevo nombre de una subcategoría que se está editando
  const guardarSub = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/subcategorias/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify({ nombre: nombreEditSub }) })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al actualizar')
    setEditandoSub(null); cargar(); msg(true, 'Subcategoría actualizada')
  }

  // Elimina una subcategoría tras confirmación del usuario y recarga la lista
  const eliminarSub = async (id) => {
    if (!confirm('¿Eliminar esta subcategoría?')) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/subcategorias/${id}`, { method: 'DELETE', headers: headers() })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al eliminar')
    cargar(); msg(true, 'Subcategoría eliminada')
  }

  // Filtra la lista para mostrar solo la categoría seleccionada en el select.
  // Si no hay filtro seleccionado, limpia el filtro y muestra todas
  const buscar = () => {
    if (!filtroCategoria) { setCategoriasFiltradas(null); return }
    setCategoriasFiltradas(categorias.filter(c => c.id === parseInt(filtroCategoria)))
  }


  // Limpia el filtro de categoría y vuelve a mostrar todas las categorías
  const limpiar = () => {
    setFiltroCategoria('')
    setCategoriasFiltradas(null)
  }

  return (
    <div className="admin-seccion">
      <h2 className="admin-seccion-titulo">Categorías y Subcategorías</h2>

      {exito && <p className="admin-exito">{exito}</p>}
      {error && <p className="admin-error">{error}</p>}

      <div className="admin-filtros">
        <p className="admin-filtros-titulo">Filtros</p>
        <div className="admin-filtros-fila">
          <label className="admin-label">Categoría:</label>
          <select className="admin-select" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="admin-filtros-botones">
          <button className="admin-btn-add" onClick={buscar}>Buscar</button>
          <button className="admin-btn-limpiar" onClick={limpiar}>Limpiar</button>
        </div>
      </div>

      <div className="admin-ordenar-wrapper">
        <label className="admin-label">Ordenar por:</label>
        <select className="admin-select" value={ordenCat} onChange={e => setOrdenCat(e.target.value)}>
          <option value="nombre-asc">Nombre A→Z</option>
          <option value="nombre-desc">Nombre Z→A</option>
          <option value="fecha-desc">Más recientes primero</option>
          <option value="fecha-asc">Más antiguas primero</option>
        </select>
      </div>

      <div className="admin-nueva-fila">
        <input className="admin-input" placeholder="Nueva categoría..." value={nuevaCategoria}
          onChange={e => setNuevaCategoria(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && crearCategoria()} />
        <button className="admin-btn-add" onClick={crearCategoria}>+ Añadir</button>
      </div>

      {cargando ? <p className="admin-cargando">Cargando...</p> : (
        <div className="admin-lista">
          {(categoriasOrdenadas).map(cat => (
            <div key={cat.id} className="admin-categoria-block">
              <div className="admin-item admin-item-categoria">
                {editandoCategoria === cat.id ? (
                  <div className="admin-edit-fila">
                    <input className="admin-input admin-input-sm" value={nombreEditCategoria}
                      onChange={e => setNombreEditCategoria(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && guardarCategoria(cat.id)} />
                    <button className="admin-btn-save" onClick={() => guardarCategoria(cat.id)}>Guardar</button>
                    <button className="admin-btn-cancel" onClick={() => setEditandoCategoria(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <span className="admin-item-nombre admin-item-nombre-cat">{cat.nombre}</span>
                    <div className="admin-item-acciones">
                      <button className="admin-btn-edit" onClick={() => { setEditandoCategoria(cat.id); setNombreEditCategoria(cat.nombre) }}>Editar</button>
                      <button className="admin-btn-delete" onClick={() => eliminarCategoria(cat.id)}>Eliminar</button>
                    </div>
                  </>
                )}
              </div>
              <div className="admin-subcategorias">
                {cat.subcategorias?.map(sub => (
                  <div key={sub.id} className="admin-item admin-item-sub">
                    {editandoSub === sub.id ? (
                      <div className="admin-edit-fila">
                        <input className="admin-input admin-input-sm" value={nombreEditSub}
                          onChange={e => setNombreEditSub(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && guardarSub(sub.id)} />
                        <button className="admin-btn-save" onClick={() => guardarSub(sub.id)}>Guardar</button>
                        <button className="admin-btn-cancel" onClick={() => setEditandoSub(null)}>✕</button>
                      </div>
                    ) : (
                      <>
                        <span className="admin-item-nombre">↳ {sub.nombre}</span>
                        <div className="admin-item-acciones">
                          <button className="admin-btn-edit" onClick={() => { setEditandoSub(sub.id); setNombreEditSub(sub.nombre) }}>Editar</button>
                          <button className="admin-btn-delete" onClick={() => eliminarSub(sub.id)}>Eliminar</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <div className="admin-nueva-sub-fila">
                  <input className="admin-input admin-input-sm" placeholder="Nueva subcategoría..."
                    value={nuevaSub[cat.id] || ''}
                    onChange={e => setNuevaSub({ ...nuevaSub, [cat.id]: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && crearSub(cat.id)} />
                  <button className="admin-btn-add admin-btn-add-sm" onClick={() => crearSub(cat.id)}>+ Añadir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===== SECCION EPOCAS =====
function SeccionEpocas() {
  const [epocas, setEpocas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nueva, setNueva] = useState('')
  const [editando, setEditando] = useState(null)
  const [nombreEdit, setNombreEdit] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [orden, setOrden] = useState('asc')

  // Carga todas las épocas desde el backend
  const cargar = () => {
    setCargando(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/epocas`, { headers: headers() })
      .then(r => r.json())
      .then(d => { setEpocas(d); setCargando(false) })
      .catch(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  // Muestra un mensaje de éxito o error durante 3 segundos y luego lo limpia
  const msg = (ok, txt) => { ok ? setExito(txt) : setError(txt); setTimeout(() => { setExito(''); setError('') }, 3000) }

  // Crea una nueva época con el nombre introducido y recarga la lista
  const crear = async () => {
    if (!nueva.trim()) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/epocas`, { method: 'POST', headers: headers(), body: JSON.stringify({ nombre: nueva }) })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al crear época')
    setNueva(''); cargar(); msg(true, 'Época creada')
  }

  // Guarda el nuevo nombre de una época que se está editando
  const guardar = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/epocas/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify({ nombre: nombreEdit }) })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al actualizar')
    setEditando(null); cargar(); msg(true, 'Época actualizada')
  }

  // Elimina una época tras confirmación del usuario y recarga la lista
  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta época?')) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/epocas/${id}`, { method: 'DELETE', headers: headers() })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al eliminar')
    cargar(); msg(true, 'Época eliminada')
  }

  // Ordena la lista de épocas alfabéticamente según la dirección seleccionada (asc/desc)
  const epocasOrdenadas = [...epocas].sort((a, b) =>
    orden === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
  )

  return (
    <div className="admin-seccion">
      <h2 className="admin-seccion-titulo">Épocas</h2>
      {exito && <p className="admin-exito">{exito}</p>}
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-nueva-fila">
        <input className="admin-input" placeholder="Nueva época..." value={nueva}
          onChange={e => setNueva(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && crear()} />
        <button className="admin-btn-add" onClick={crear}>+ Añadir</button>
      </div>
      {cargando ? <p className="admin-cargando">Cargando...</p> : (
        <div className="admin-tabla-wrapper">
          <div className="admin-tabla-header">
            <span className="admin-tabla-th admin-tabla-th-sortable" onClick={() => setOrden(orden === 'asc' ? 'desc' : 'asc')}>
              Nombre {orden === 'asc' ? '↑' : '↓'}
            </span>
            <span className="admin-tabla-th admin-tabla-th-right">Acciones</span>
          </div>
          {epocasOrdenadas.map(e => (
            <div key={e.id} className="admin-item">
              {editando === e.id ? (
                <div className="admin-edit-fila">
                  <input className="admin-input admin-input-sm" value={nombreEdit}
                    onChange={ev => setNombreEdit(ev.target.value)}
                    onKeyDown={ev => ev.key === 'Enter' && guardar(e.id)} />
                  <button className="admin-btn-save" onClick={() => guardar(e.id)}>Guardar</button>
                  <button className="admin-btn-cancel" onClick={() => setEditando(null)}>✕</button>
                </div>
              ) : (
                <>
                  <span className="admin-item-nombre">{e.nombre}</span>
                  <div className="admin-item-acciones">
                    <button className="admin-btn-edit" onClick={() => { setEditando(e.id); setNombreEdit(e.nombre) }}>Editar</button>
                    <button className="admin-btn-delete" onClick={() => eliminar(e.id)}>Eliminar</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===== SECCION PAISES =====
function SeccionPaises() {
  const [paises, setPaises] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nueva, setNueva] = useState('')
  const [editando, setEditando] = useState(null)
  const [nombreEdit, setNombreEdit] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [orden, setOrden] = useState('asc')

  // Carga todos los países desde el backend
  const cargar = () => {
    setCargando(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/paises`, { headers: headers() })
      .then(r => r.json())
      .then(d => { setPaises(d); setCargando(false) })
      .catch(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  // Muestra un mensaje de éxito o error durante 3 segundos y luego lo limpia
  const msg = (ok, txt) => { ok ? setExito(txt) : setError(txt); setTimeout(() => { setExito(''); setError('') }, 3000) }

  // Crea un nuevo país con el nombre introducido y recarga la lista
  const crear = async () => {
    if (!nueva.trim()) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/paises`, { method: 'POST', headers: headers(), body: JSON.stringify({ nombre: nueva }) })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al crear país')
    setNueva(''); cargar(); msg(true, 'País creado')
  }

  // Guarda el nuevo nombre de un país que se está editando
  const guardar = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/paises/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify({ nombre: nombreEdit }) })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al actualizar')
    setEditando(null); cargar(); msg(true, 'País actualizado')
  }

  // Elimina un país tras confirmación del usuario y recarga la lista
  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este país?')) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/paises/${id}`, { method: 'DELETE', headers: headers() })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al eliminar')
    cargar(); msg(true, 'País eliminado')
  }

  // Ordena la lista de países alfabéticamente según la dirección seleccionada (asc/desc)
  const paisesOrdenados = [...paises].sort((a, b) =>
    orden === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
  )

  return (
    <div className="admin-seccion">
      <h2 className="admin-seccion-titulo">Países de origen</h2>
      {exito && <p className="admin-exito">{exito}</p>}
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-nueva-fila">
        <input className="admin-input" placeholder="Nuevo país..." value={nueva}
          onChange={e => setNueva(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && crear()} />
        <button className="admin-btn-add" onClick={crear}>+ Añadir</button>
      </div>
      {cargando ? <p className="admin-cargando">Cargando...</p> : (
        <div className="admin-tabla-wrapper">
          <div className="admin-tabla-header">
            <span className="admin-tabla-th admin-tabla-th-sortable" onClick={() => setOrden(orden === 'asc' ? 'desc' : 'asc')}>
              Nombre {orden === 'asc' ? '↑' : '↓'}
            </span>
            <span className="admin-tabla-th admin-tabla-th-right">Acciones</span>
          </div>
          {paisesOrdenados.map(p => (
            <div key={p.id} className="admin-item">
              {editando === p.id ? (
                <div className="admin-edit-fila">
                  <input className="admin-input admin-input-sm" value={nombreEdit}
                    onChange={ev => setNombreEdit(ev.target.value)}
                    onKeyDown={ev => ev.key === 'Enter' && guardar(p.id)} />
                  <button className="admin-btn-save" onClick={() => guardar(p.id)}>Guardar</button>
                  <button className="admin-btn-cancel" onClick={() => setEditando(null)}>✕</button>
                </div>
              ) : (
                <>
                  <span className="admin-item-nombre">{p.nombre}</span>
                  <div className="admin-item-acciones">
                    <button className="admin-btn-edit" onClick={() => { setEditando(p.id); setNombreEdit(p.nombre) }}>Editar</button>
                    <button className="admin-btn-delete" onClick={() => eliminar(p.id)}>Eliminar</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===== SECCION USUARIOS =====
function SeccionUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const [filtroRol, setFiltroRol] = useState('')
  const [filtroReservas, setFiltroReservas] = useState('')
  const [filtroAlquileres, setFiltroAlquileres] = useState('')
  const [filtroTelefono, setFiltroTelefono] = useState('')
  const [listaFiltrada, setListaFiltrada] = useState(null)

  const [modalNuevo, setModalNuevo] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoEmail, setNuevoEmail] = useState('')
  const [nuevoPassword, setNuevoPassword] = useState('')
  const [nuevoTelefono, setNuevoTelefono] = useState('')
  const [nuevoRol, setNuevoRol] = useState('cliente')
  const [creando, setCreando] = useState(false)

  const [orden, setOrden] = useState({ col: 'name', dir: 'asc' })

  // Carga todos los usuarios desde el backend
  const cargar = () => {
    setCargando(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/usuarios`, { headers: headers() })
      .then(r => r.json())
      .then(d => { setUsuarios(d); setCargando(false) })
      .catch(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  const msg = (ok, txt) => { ok ? setExito(txt) : setError(txt); setTimeout(() => { setExito(''); setError('') }, 3000) }

  // Cambia la columna y dirección de ordenación. Si se pulsa la misma columna
  // que ya está activa, invierte la dirección (asc → desc o desc → asc)
  const cambiarOrden = (col) => {
    setOrden(prev => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }))
  }

  // Devuelve el icono de flecha (↑ o ↓) para la columna activa, o vacío si no es la activa
  const icono = (col) => orden.col === col ? (orden.dir === 'asc' ? ' ↑' : ' ↓') : ''

  // Cambia el rol del usuario entre 'admin' y 'cliente' tras confirmación
  const cambiarRol = async (id, rolActual) => {
    const nuevoRol = rolActual === 'admin' ? 'cliente' : 'admin'
    if (!confirm(`¿Cambiar rol a "${nuevoRol}"?`)) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/usuarios/${id}/rol`, {
      method: 'PUT', headers: headers(), body: JSON.stringify({ rol: nuevoRol })
    })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al cambiar rol')
    cargar(); msg(true, 'Rol actualizado')
  }

  // Elimina un usuario tras confirmación. Solo se permite con usuarios que no son admin
  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/usuarios/${id}`, { method: 'DELETE', headers: headers() })
    const data = await res.json()
    if (!res.ok) return msg(false, data.mensaje || 'Error al eliminar')
    cargar(); msg(true, 'Usuario eliminado')
  }

  const crearUsuario = async () => {
    setCreando(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/usuarios`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          name: nuevoNombre,
          email: nuevoEmail,
          password: nuevoPassword,
          telefono: nuevoTelefono,
          rol: nuevoRol,
        })
      })
      const data = await res.json()
      if (!res.ok) return msg(false, data.message || data.mensaje || 'Error al crear usuario')
      setModalNuevo(false)
      setNuevoNombre(''); setNuevoEmail(''); setNuevoPassword('')
      setNuevoTelefono(''); setNuevoRol('cliente')
      cargar(); msg(true, 'Usuario creado correctamente')
    } catch { msg(false, 'Error de conexión') }
    finally { setCreando(false) }
  }

  // Aplica los filtros activos sobre la lista completa de usuarios y guarda el resultado.
  // Filtra por rol, si tiene reservas, alquileres o teléfono según los selects activos
  const buscar = () => {
    let lista = [...usuarios]
    if (filtroRol) lista = lista.filter(u => u.rol === filtroRol)
    if (filtroReservas === 'si') lista = lista.filter(u => u.reservas_count > 0)
    if (filtroReservas === 'no') lista = lista.filter(u => u.reservas_count === 0)
    if (filtroAlquileres === 'si') lista = lista.filter(u => u.alquileres_count > 0)
    if (filtroAlquileres === 'no') lista = lista.filter(u => u.alquileres_count === 0)
    if (filtroTelefono === 'si') lista = lista.filter(u => u.telefono && u.telefono.trim() !== '')
    if (filtroTelefono === 'no') lista = lista.filter(u => !u.telefono || u.telefono.trim() === '')
    setListaFiltrada(lista)
  }

  // Limpia todos los filtros y vuelve a mostrar la lista completa
  const limpiar = () => {
    setFiltroRol(''); setFiltroReservas(''); setFiltroAlquileres(''); setFiltroTelefono('')
    setListaFiltrada(null)
  }

  // Genera una celda de cabecera de tabla clicable que ordena por la columna indicada,
  // mostrando el icono de dirección si es la columna activa
  const thSortable = (col, label) => (
    <span className="admin-tabla-th admin-tabla-th-sortable admin-th-u" onClick={() => cambiarOrden(col)}>
      {label}{icono(col)}
    </span>
  )

  // Ordena la lista base (filtrada o completa) según la columna y dirección activas.
  // Compara strings con localeCompare y números con resta
  const listaBase = listaFiltrada || usuarios
  const listaOrdenada = [...listaBase].sort((a, b) => {
    const { col, dir } = orden
    const va = a[col], vb = b[col]
    if (typeof va === 'string') return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    return dir === 'asc' ? va - vb : vb - va
  })

  return (
    <div className="admin-seccion">
      <h2 className="admin-seccion-titulo">Usuarios</h2>

      {exito && <p className="admin-exito">{exito}</p>}
      {error && <p className="admin-error">{error}</p>}

      {/* FILTROS */}
      <div className="admin-filtros">
        <p className="admin-filtros-titulo">Filtros</p>
        <div className="admin-filtros-grid">
          <div className="admin-filtros-fila">
            <label className="admin-label">Rol:</label>
            <select className="admin-select" value={filtroRol} onChange={e => setFiltroRol(e.target.value)}>
              <option value="">Todos</option>
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="admin-filtros-fila">
            <label className="admin-label">Tiene reservas:</label>
            <select className="admin-select" value={filtroReservas} onChange={e => setFiltroReservas(e.target.value)}>
              <option value="">Todos</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="admin-filtros-fila">
            <label className="admin-label">Tiene alquileres:</label>
            <select className="admin-select" value={filtroAlquileres} onChange={e => setFiltroAlquileres(e.target.value)}>
              <option value="">Todos</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="admin-filtros-fila">
            <label className="admin-label">Tiene teléfono:</label>
            <select className="admin-select" value={filtroTelefono} onChange={e => setFiltroTelefono(e.target.value)}>
              <option value="">Todos</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <div className="admin-filtros-botones">
          <button className="admin-btn-add" onClick={buscar}>Buscar</button>
          <button className="admin-btn-limpiar" onClick={limpiar}>Limpiar</button>
        </div>
      </div>

      {/* ORDENAR POR: EN PANTALLAS PEQUEÑAS */}
      <div className="admin-ordenar-wrapper admin-ordenar-movil">
        <label className="admin-label">Ordenar por:</label>
        <select className="admin-select" value={`${orden.col}-${orden.dir}`}
          onChange={e => {
            const [col, dir] = e.target.value.split('-')
            setOrden({ col, dir })
          }}>
          <option value="name-asc">Nombre A→Z</option>
          <option value="name-desc">Nombre Z→A</option>
          <option value="reservas_count-desc">Más reservas</option>
          <option value="reservas_count-asc">Menos reservas</option>
          <option value="alquileres_count-desc">Más alquileres</option>
          <option value="alquileres_count-asc">Menos alquileres</option>
          <option value="rol-asc">Rol A→Z</option>
          <option value="rol-desc">Rol Z→A</option>
        </select>
      </div>

      <button className="admin-user-add" onClick={() => setModalNuevo(true)}>
        + Nuevo usuario
      </button>

      {modalNuevo && (
        <div className="modal-overlay" onClick={() => setModalNuevo(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setModalNuevo(false)}>✕</button>
            <h2 className="modal-titulo">Nuevo usuario</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75em', marginTop: '1em' }}>
              <input className="admin-input" placeholder="Nombre *" value={nuevoNombre}
                onChange={e => setNuevoNombre(e.target.value)} />
              <input className="admin-input" placeholder="Email *" type="email" value={nuevoEmail}
                onChange={e => setNuevoEmail(e.target.value)} />
              <input className="admin-input" placeholder="Contraseña * (mín. 8 caracteres)" type="password" value={nuevoPassword}
                onChange={e => setNuevoPassword(e.target.value)} />
              <input className="admin-input" placeholder="Teléfono (opcional)" value={nuevoTelefono}
                onChange={e => setNuevoTelefono(e.target.value)} />
              <select className="admin-select" value={nuevoRol} onChange={e => setNuevoRol(e.target.value)}>
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="modal-botones" style={{ marginTop: '1.5em' }}>
              <button className="admin-btn-add" onClick={crearUsuario} disabled={creando}>
                {creando ? 'Creando...' : 'Crear Usuario'}
              </button>
              <button className="admin-btn-limpiar" onClick={() => setModalNuevo(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLA */}
      {cargando ? <p className="admin-cargando">Cargando...</p> : (
        <div className="admin-tabla-wrapper">
          <div className="admin-tabla-header admin-tabla-header-u">
            {thSortable('name', 'Nombre')}
            <span className="admin-tabla-th admin-th-u">Email</span>
            <span className="admin-tabla-th admin-th-u">Teléfono</span>
            {thSortable('reservas_count', 'Reservas')}
            {thSortable('alquileres_count', 'Alquileres')}
            {thSortable('rol', 'Rol')}
            <span className="admin-tabla-th admin-th-u admin-th-u-acciones">Acciones</span>
          </div>

          {listaOrdenada.map(u => (
            <div key={u.id} className="admin-item admin-item-u">
              <span className="admin-cell-u admin-item-nombre">
                <span className="admin-cell-label">Nombre:</span>{u.name}
              </span>
              <span className="admin-cell-u">
                <span className="admin-cell-label">Email:</span>{u.email}
              </span>
              <span className="admin-cell-u">
                <span className="admin-cell-label">Teléfono:</span>{u.telefono || '—'}
              </span>
              <span className="admin-cell-u">
                <span className="admin-cell-label">Reservas:</span>{u.reservas_count}
              </span>
              <span className="admin-cell-u">
                <span className="admin-cell-label">Alquileres:</span>{u.alquileres_count}
              </span>
              <span className="admin-cell-u">
                <span className="admin-cell-label">Rol:</span>
                <span className={`admin-rol-badge ${u.rol === 'admin' ? 'admin-rol-admin' : 'admin-rol-cliente'}`}>
                  {u.rol}
                </span>
              </span>
              <div className="admin-cell-u admin-cell-u-acciones">
                <button className="admin-btn-edit" onClick={() => cambiarRol(u.id, u.rol)}>
                  {u.rol === 'admin' ? '→ Cliente' : '→ Admin'}
                </button>
                {u.rol !== 'admin' && (
                  <button className="admin-btn-delete" onClick={() => eliminar(u.id)}>Eliminar</button>
                )}
              </div>
            </div>
          ))}

          {listaOrdenada.length === 0 && (
            <p className="admin-vacio" style={{ padding: '1em 0' }}>No hay usuarios con ese filtro.</p>
          )}
        </div>
      )}

      <span className="aviso">* No puedes editar los datos de un usuario, cada usuario deberá iniciar sesión y editar sus propios datos en Mi Perfil</span>
    </div>
  )
}

function SeccionReservas() {
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [listaFiltrada, setListaFiltrada] = useState(null)
  const [orden, setOrden] = useState({ col: 'created_at', dir: 'desc' })
  const [ordenSelect, setOrdenSelect] = useState('desc')
  const [cambiando, setCambiando] = useState(null)
  const [filtroRecogidaDesde, setFiltroRecogidaDesde] = useState('')
  const [filtroRecogidaHasta, setFiltroRecogidaHasta] = useState('')
  const [ordenSelectMovil, setOrdenSelectMovil] = useState('---')
  const [editandoFecha, setEditandoFecha] = useState(null)
  const [nuevaFecha, setNuevaFecha] = useState('')

  const cargar = () => {
    setCargando(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/reservas`, { headers: headers() })
      .then(r => r.json())
      .then(d => { setReservas(d); setCargando(false) })
      .catch(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  const msg = (ok, txt) => { ok ? setExito(txt) : setError(txt); setTimeout(() => { setExito(''); setError('') }, 3000) }

  const cambiarOrden = (col) => {
    setOrdenSelect('---')
    setOrdenSelectMovil('---')
    setOrden(prev => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }))
  }

  const icono = (col) => orden.col === col ? (orden.dir === 'asc' ? ' ↑' : ' ↓') : ''

  // Cambia el estado de una reserva (aceptada, cancelada, completada...) y recarga la lista.
  // Mientras se procesa, marca la reserva como "cambiando" para deshabilitar sus botones
  const cambiarEstado = async (id, estado) => {
    setCambiando(id)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reservas/${id}/estado`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ estado })
      })
      const data = await res.json()
      if (!res.ok) return msg(false, data.mensaje || 'Error al cambiar estado')
      cargar(); msg(true, 'Estado actualizado')
    } catch { msg(false, 'Error de conexión') }
    finally { setCambiando(null) }
  }

  // Guarda la nueva fecha de recogida de una reserva que se está editando.
  // Cierra el modo edición y recarga la lista tras guardar correctamente
  const guardarFecha = async (id) => {
    if (!nuevaFecha) return
    setCambiando(id)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reservas/${id}`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ fecha_recogida: nuevaFecha })
      })
      const data = await res.json()
      if (!res.ok) return msg(false, data.mensaje || 'Error al actualizar fecha')
      setEditandoFecha(null); setNuevaFecha(''); cargar(); msg(true, 'Fecha actualizada')
    } catch { msg(false, 'Error de conexión') }
    finally { setCambiando(null) }
  }

  // Aplica los filtros activos sobre la lista completa de reservas.
  // Filtra por estado y por rango de fecha de recogida (desde/hasta)
  const buscar = () => {
    let lista = [...reservas]
    if (filtroEstado) lista = lista.filter(r => r.estado === filtroEstado)
    if (filtroRecogidaDesde) lista = lista.filter(r => r.fecha_recogida >= filtroRecogidaDesde)
    if (filtroRecogidaHasta) lista = lista.filter(r => r.fecha_recogida <= filtroRecogidaHasta)
    setListaFiltrada(lista)
  }

  // Limpia todos los filtros y vuelve a mostrar la lista completa
  const limpiar = () => { setFiltroEstado(''); setListaFiltrada(null); setFiltroRecogidaDesde(''); setFiltroRecogidaHasta(''); }

  // Ordena la lista base (filtrada o completa) según la columna y dirección activas.
  // Para usuario y producto accede a las relaciones anidadas; para fechas compara como Date
  const listaBase = listaFiltrada || reservas
  const listaOrdenada = [...listaBase].sort((a, b) => {
    const { col, dir } = orden
    let va = col === 'usuario' ? (a.usuario?.name || '') : col === 'producto' ? (a.producto?.nombre || '') : col === 'estado' ? a.estado : (a[col] || '')
    let vb = col === 'usuario' ? (b.usuario?.name || '') : col === 'producto' ? (b.producto?.nombre || '') : col === 'estado' ? b.estado : (b[col] || '')
    if (typeof va === 'string') return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    return dir === 'asc' ? new Date(va) - new Date(vb) : new Date(vb) - new Date(va)
  })

  return (
    <div className="admin-seccion">
      <h2 className="admin-seccion-titulo">Reservas</h2>

      {exito && <p className="admin-exito">{exito}</p>}
      {error && <p className="admin-error">{error}</p>}

      {/* FILTROS */}
      <div className="admin-filtros">
        <p className="admin-filtros-titulo">Filtros</p>
        <div className="admin-filtros-grid">
          <div className="admin-filtros-fila">
            <label className="admin-label">Estado:</label>
            <select className="admin-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="">Todos</option>
              <option value="solicitada">Solicitada</option>
              <option value="aceptada">Aceptada</option>
              <option value="cancelada">Cancelada</option>
              <option value="completada">Completada</option>
              <option value="expirada">Expirada</option>
            </select>
          </div>
          <div className="admin-filtros-fila">
            <label className="admin-label">Recogida desde:</label>
            <input className="admin-input" type="date" value={filtroRecogidaDesde}
              onChange={e => setFiltroRecogidaDesde(e.target.value)} />
          </div>
          <div className="admin-filtros-fila">
            <label className="admin-label">Recogida hasta:</label>
            <input className="admin-input" type="date" value={filtroRecogidaHasta}
              onChange={e => setFiltroRecogidaHasta(e.target.value)} />
          </div>
        </div>

        <div className="admin-filtros-botones">
          <button className="admin-btn-add" onClick={buscar}>Buscar</button>
          <button className="admin-btn-limpiar" onClick={limpiar}>Limpiar</button>
        </div>
      </div>

      {/* ORDENAR */}
      <div className="admin-ordenar-wrapper">
        <label className="admin-label">Ordenar por fecha de solicitud:</label>
        <select className="admin-select" value={ordenSelect} onChange={e => {
          setOrdenSelect(e.target.value)
          setOrdenSelectMovil('---')
          if (e.target.value !== '---') setOrden({ col: 'created_at', dir: e.target.value })
        }}>
          <option value="---">—</option>
          <option value="desc">Más recientes primero</option>
          <option value="asc">Más antiguas primero</option>
        </select>
      </div>

      {/* ORDENAR EN MÓVIL */}
      <div className="admin-ordenar-wrapper admin-ordenar-movil">
        <label className="admin-label">Ordenar por:</label>
        <select className="admin-select" value={ordenSelectMovil} onChange={e => {
          setOrdenSelectMovil(e.target.value)
          setOrdenSelect('---')
          if (e.target.value !== '---') {
            const [col, dir] = e.target.value.split('-')
            setOrden({ col, dir })
          }
        }}>
          <option value="---">—</option>
          <option value="usuario-asc">Usuario A→Z</option>
          <option value="usuario-desc">Usuario Z→A</option>
          <option value="producto-asc">Producto A→Z</option>
          <option value="producto-desc">Producto Z→A</option>
          <option value="fecha_recogida-asc">Fecha recogida ↑</option>
          <option value="fecha_recogida-desc">Fecha recogida ↓</option>
          <option value="estado-asc">Estado A→Z</option>
          <option value="estado-desc">Estado Z→A</option>
        </select>
      </div>

      {/* TABLA */}
      {cargando ? <p className="admin-cargando">Cargando...</p> : (
        <div className="admin-tabla-wrapper">
          <div className="admin-tabla-header admin-tabla-header-rv">
            <span className="admin-tabla-th admin-th-rv admin-tabla-th-sortable" onClick={() => cambiarOrden('usuario')}>
              Usuario{icono('usuario')}
            </span>
            <span className="admin-tabla-th admin-th-rv admin-tabla-th-sortable" onClick={() => cambiarOrden('producto')}>
              Producto{icono('producto')}
            </span>
            <span className="admin-tabla-th admin-th-rv admin-tabla-th-sortable" onClick={() => cambiarOrden('fecha_recogida')}>
              Fecha recogida{icono('fecha_recogida')}
            </span>
            <span className="admin-tabla-th admin-th-rv admin-tabla-th-sortable" onClick={() => cambiarOrden('estado')}>
              Estado{icono('estado')}
            </span>
            <span className="admin-tabla-th admin-th-rv admin-th-rv-acciones">Acciones</span>
          </div>

          {listaOrdenada.map(r => {
            const col = COLORES_ESTADO[r.estado] || { color: '#888', bg: '#f5f5f5' }
            const cargandoEste = cambiando === r.id
            return (
              <div key={r.id} className="admin-item admin-item-rv">
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Usuario:</span>
                  {r.usuario?.name || '—'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Producto:</span>
                  {r.producto?.nombre || '—'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Fecha recogida:</span>
                  {editandoFecha === r.id ? (
                    <span className="admin-fecha-edit">
                      <input className="admin-input admin-input-sm" type="date"
                        value={nuevaFecha}
                        onChange={e => setNuevaFecha(e.target.value)} />
                    </span>
                  ) : (
                    <span className="admin-fecha-edit">
                      {formatFecha(r.fecha_recogida)}
                      <button className="admin-btn-icon" onClick={() => { setEditandoFecha(r.id); setNuevaFecha(r.fecha_recogida || '') }} title="Editar fecha">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </span>
                  )}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Estado:</span>
                  <span className="admin-estado-badge" style={{ color: col.color, background: col.bg }}>
                    {r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}
                  </span>
                </span>
                <div className="admin-cell-rv admin-cell-rv-acciones">
                  {editandoFecha === r.id && (
                    <>
                      <button className="admin-btn-save" disabled={cargandoEste} onClick={() => guardarFecha(r.id)}>Guardar</button>
                      <button className="admin-btn-cancel" onClick={() => { setEditandoFecha(null); setNuevaFecha('') }}>✕</button>
                    </>
                  )}
                  {r.estado === 'solicitada' && (
                    <>
                      <button className="admin-btn-accion admin-btn-accion-accept" disabled={cargandoEste}
                        onClick={() => cambiarEstado(r.id, 'aceptada')}>
                        Aceptar
                      </button>
                      <button className="admin-btn-accion admin-btn-accion-cancel" disabled={cargandoEste}
                        onClick={() => cambiarEstado(r.id, 'cancelada')}>
                        Cancelar
                      </button>
                    </>
                  )}
                  {r.estado === 'aceptada' && (
                    <>
                      <button className="admin-btn-accion admin-btn-accion-complete" disabled={cargandoEste}
                        onClick={() => cambiarEstado(r.id, 'completada')}>
                        Completar
                      </button>
                      <button className="admin-btn-accion admin-btn-accion-cancel" disabled={cargandoEste}
                        onClick={() => cambiarEstado(r.id, 'cancelada')}>
                        Cancelar
                      </button>
                    </>
                  )}
                  {r.estado === 'expirada' && (
                    <button className="admin-btn-accion admin-btn-accion-complete" disabled={cargandoEste}
                      onClick={() => cambiarEstado(r.id, 'completada')}>
                      Completar
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {listaOrdenada.length === 0 && (
            <p className="admin-vacio" style={{ padding: '1em 0' }}>No hay reservas con ese filtro.</p>
          )}
        </div>
      )}
    </div>
  )
}

function SeccionAlquileres() {
  const [alquileres, setAlquileres] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [listaFiltrada, setListaFiltrada] = useState(null)
  const [orden, setOrden] = useState({ col: 'created_at', dir: 'desc' })
  const [ordenSelect, setOrdenSelect] = useState('desc')
  const [cambiando, setCambiando] = useState(null)
  const [filtroRecogidaDesde, setFiltroRecogidaDesde] = useState('')
  const [filtroRecogidaHasta, setFiltroRecogidaHasta] = useState('')
  // Alquileres tiene también filtro por fecha de devolución
  const [filtroDevolucionDesde, setFiltroDevolucionDesde] = useState('')
  const [filtroDevolucionHasta, setFiltroDevolucionHasta] = useState('')
  const [ordenSelectMovil, setOrdenSelectMovil] = useState('---')
  const [editandoFecha, setEditandoFecha] = useState(null)
  // A diferencia de reservas (una sola fecha), alquileres maneja dos fechas editables
  const [nuevaRecogida, setNuevaRecogida] = useState('')
  const [nuevaDevolucion, setNuevaDevolucion] = useState('')

  const cargar = () => {
    setCargando(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/alquileres`, { headers: headers() })
      .then(r => r.json())
      .then(d => { setAlquileres(d); setCargando(false) })
      .catch(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  const msg = (ok, txt) => { ok ? setExito(txt) : setError(txt); setTimeout(() => { setExito(''); setError('') }, 3000) }

  const cambiarOrden = (col) => {
    setOrdenSelect('---')
    setOrdenSelectMovil('---')
    setOrden(prev => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }))
  }

  const icono = (col) => orden.col === col ? (orden.dir === 'asc' ? ' ↑' : ' ↓') : ''

  // Igual que en reservas pero los estados posibles son distintos:
  // solicitado, aceptado, recogido, retrasado, cancelado, completado, expirado
  const cambiarEstado = async (id, estado) => {
    setCambiando(id)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/alquileres/${id}/estado`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ estado })
      })
      const data = await res.json()
      if (!res.ok) return msg(false, data.mensaje || 'Error al cambiar estado')
      cargar(); msg(true, 'Estado actualizado')
    } catch { msg(false, 'Error de conexión') }
    finally { setCambiando(null) }
  }

  // Se guardan dos fechas a la vez: recogida y devolución en una sola petición PUT
  const guardarFechas = async (id) => {
    setCambiando(id)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/alquileres/${id}`, {
        method: 'PUT', headers: headers(),
        body: JSON.stringify({ fecha_recogida: nuevaRecogida, fecha_devolucion: nuevaDevolucion })
      })
      const data = await res.json()
      if (!res.ok) return msg(false, data.mensaje || 'Error al actualizar fechas')
      setEditandoFecha(null); setNuevaRecogida(''); setNuevaDevolucion(''); cargar(); msg(true, 'Fechas actualizadas')
    } catch { msg(false, 'Error de conexión') }
    finally { setCambiando(null) }
  }

  // A diferencia de reservas, el buscar filtra también por rango de fecha de devolución
  const buscar = () => {
    let lista = [...alquileres]
    if (filtroEstado) lista = lista.filter(a => a.estado === filtroEstado)
    if (filtroRecogidaDesde) lista = lista.filter(a => a.fecha_recogida >= filtroRecogidaDesde)
    if (filtroRecogidaHasta) lista = lista.filter(a => a.fecha_recogida <= filtroRecogidaHasta)
    if (filtroDevolucionDesde) lista = lista.filter(a => a.fecha_devolucion >= filtroDevolucionDesde)
    if (filtroDevolucionHasta) lista = lista.filter(a => a.fecha_devolucion <= filtroDevolucionHasta)
    setListaFiltrada(lista)
  }

  const limpiar = () => {
    setFiltroEstado(''); setListaFiltrada(null); setFiltroRecogidaDesde(''); setFiltroRecogidaHasta('')
    setFiltroDevolucionDesde(''); setFiltroDevolucionHasta('');
  }

  const listaBase = listaFiltrada || alquileres
  const listaOrdenada = [...listaBase].sort((a, b) => {
    const { col, dir } = orden
    let va = col === 'usuario' ? (a.usuario?.name || '') : col === 'producto' ? (a.producto?.nombre || '') : col === 'estado' ? a.estado : (a[col] || '')
    let vb = col === 'usuario' ? (b.usuario?.name || '') : col === 'producto' ? (b.producto?.nombre || '') : col === 'estado' ? b.estado : (b[col] || '')
    if (typeof va === 'string') return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    return dir === 'asc' ? new Date(va) - new Date(vb) : new Date(vb) - new Date(va)
  })

  return (
    <div className="admin-seccion">
      <h2 className="admin-seccion-titulo">Alquileres</h2>

      {exito && <p className="admin-exito">{exito}</p>}
      {error && <p className="admin-error">{error}</p>}

      {/* FILTROS */}
      <div className="admin-filtros">
        <p className="admin-filtros-titulo">Filtros</p>
        <div className="admin-filtros-grid">
          <div className="admin-filtros-fila">
            <label className="admin-label">Estado:</label>
            <select className="admin-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="">Todos</option>
              <option value="solicitado">Solicitado</option>
              <option value="aceptado">Aceptado</option>
              <option value="recogido">Recogido</option>
              <option value="retrasado">Retrasado</option>
              <option value="cancelado">Cancelado</option>
              <option value="completado">Completado</option>
              <option value="expirado">Expirado</option>
            </select>
          </div>
          <div className="admin-filtros-fila">
            <label className="admin-label">Recogida desde:</label>
            <input className="admin-input" type="date" value={filtroRecogidaDesde}
              onChange={e => setFiltroRecogidaDesde(e.target.value)} />
          </div>
          <div className="admin-filtros-fila">
            <label className="admin-label">Recogida hasta:</label>
            <input className="admin-input" type="date" value={filtroRecogidaHasta}
              onChange={e => setFiltroRecogidaHasta(e.target.value)} />
          </div>
          <div className="admin-filtros-fila">
            <label className="admin-label">Devolución desde:</label>
            <input className="admin-input" type="date" value={filtroDevolucionDesde}
              onChange={e => setFiltroDevolucionDesde(e.target.value)} />
          </div>
          <div className="admin-filtros-fila">
            <label className="admin-label">Devolución hasta:</label>
            <input className="admin-input" type="date" value={filtroDevolucionHasta}
              onChange={e => setFiltroDevolucionHasta(e.target.value)} />
          </div>
        </div>

        <div className="admin-filtros-botones">
          <button className="admin-btn-add" onClick={buscar}>Buscar</button>
          <button className="admin-btn-limpiar" onClick={limpiar}>Limpiar</button>
        </div>
      </div>

      {/* ORDENAR */}
      <div className="admin-ordenar-wrapper">
        <label className="admin-label">Ordenar por fecha de solicitud:</label>
        <select className="admin-select" value={ordenSelect} onChange={e => {
          setOrdenSelect(e.target.value)
          setOrdenSelectMovil('---')
          if (e.target.value !== '---') setOrden({ col: 'created_at', dir: e.target.value })
        }}>
          <option value="---">—</option>
          <option value="desc">Más recientes primero</option>
          <option value="asc">Más antiguos primero</option>
        </select>
      </div>

      <div className="admin-ordenar-wrapper admin-ordenar-movil">
        <label className="admin-label">Ordenar por:</label>
        <select className="admin-select" value={ordenSelectMovil} onChange={e => {
          setOrdenSelectMovil(e.target.value)
          setOrdenSelect('---')
          if (e.target.value !== '---') {
            const [col, dir] = e.target.value.split('-')
            setOrden({ col, dir })
          }
        }}>
          <option value="---">—</option>
          <option value="usuario-asc">Usuario A→Z</option>
          <option value="usuario-desc">Usuario Z→A</option>
          <option value="producto-asc">Producto A→Z</option>
          <option value="producto-desc">Producto Z→A</option>
          <option value="fecha_recogida-asc">Recogida ↑</option>
          <option value="fecha_recogida-desc">Recogida ↓</option>
          <option value="fecha_devolucion-asc">Devolución ↑</option>
          <option value="fecha_devolucion-desc">Devolución ↓</option>
          <option value="estado-asc">Estado A→Z</option>
          <option value="estado-desc">Estado Z→A</option>
        </select>
      </div>

      {/* TABLA */}
      {cargando ? <p className="admin-cargando">Cargando...</p> : (
        <div className="admin-tabla-wrapper">
          <div className="admin-tabla-header admin-tabla-header-al">
            <span className="admin-tabla-th admin-th-rv admin-tabla-th-sortable" onClick={() => cambiarOrden('usuario')}>Usuario{icono('usuario')}</span>
            <span className="admin-tabla-th admin-th-rv admin-tabla-th-sortable" onClick={() => cambiarOrden('producto')}>Producto{icono('producto')}</span>
            <span className="admin-tabla-th admin-th-rv admin-tabla-th-sortable" onClick={() => cambiarOrden('fecha_recogida')}>Recogida{icono('fecha_recogida')}</span>
            <span className="admin-tabla-th admin-th-rv admin-tabla-th-sortable" onClick={() => cambiarOrden('fecha_devolucion')}>Devolución{icono('fecha_devolucion')}</span>
            <span className="admin-tabla-th admin-th-rv admin-tabla-th-sortable" onClick={() => cambiarOrden('estado')}>Estado{icono('estado')}</span>
            <span className="admin-tabla-th admin-th-rv admin-th-rv-acciones">Acciones</span>
          </div>

          {listaOrdenada.map(a => {
            const col = COLORES_ESTADO[a.estado] || { color: '#888', bg: '#f5f5f5' }
            const cargandoEste = cambiando === a.id
            return (
              <div key={a.id} className="admin-item admin-item-al">
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Usuario:</span>
                  {a.usuario?.name || '—'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Producto:</span>
                  {a.producto?.nombre || '—'}
                </span>
                {editandoFecha === a.id ? (
                  <>
                    <span className="admin-cell-rv">
                      <span className="admin-cell-label">Recogida:</span>
                      <input className="admin-input admin-input-sm" type="date"
                        value={nuevaRecogida} onChange={e => setNuevaRecogida(e.target.value)} />
                    </span>
                    <span className="admin-cell-rv">
                      <span className="admin-cell-label">Devolución:</span>
                      <input className="admin-input admin-input-sm" type="date"
                        value={nuevaDevolucion} onChange={e => setNuevaDevolucion(e.target.value)} />
                    </span>
                  </>
                ) : (
                  <>
                    <span className="admin-cell-rv">
                      <span className="admin-cell-label">Recogida:</span>
                      {formatFecha(a.fecha_recogida)}
                    </span>
                    <span className="admin-cell-rv">
                      <span className="admin-cell-label">Devolución:</span>
                      <span className="admin-fecha-edit">
                        {formatFecha(a.fecha_devolucion)}
                        <button className="admin-btn-icon" onClick={() => { setEditandoFecha(a.id); setNuevaRecogida(a.fecha_recogida || ''); setNuevaDevolucion(a.fecha_devolucion || '') }} title="Editar fechas">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      </span>
                    </span>
                  </>
                )}
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Estado:</span>
                  <span className="admin-estado-badge" style={{ color: col.color, background: col.bg }}>
                    {a.estado.charAt(0).toUpperCase() + a.estado.slice(1)}
                  </span>
                </span>
                <div className="admin-cell-rv admin-cell-rv-acciones">
                  {editandoFecha === a.id && (
                    <>
                      <button className="admin-btn-save" disabled={cargandoEste} onClick={() => guardarFechas(a.id)}>Guardar</button>
                      <button className="admin-btn-cancel" onClick={() => { setEditandoFecha(null); setNuevaRecogida(''); setNuevaDevolucion('') }}>✕</button>
                    </>
                  )}
                  {a.estado === 'solicitado' && (
                    <>
                      <button className="admin-btn-accion admin-btn-accion-accept" disabled={cargandoEste}
                        onClick={() => cambiarEstado(a.id, 'aceptado')}>
                        Aceptar
                      </button>
                      <button className="admin-btn-accion admin-btn-accion-cancel" disabled={cargandoEste}
                        onClick={() => cambiarEstado(a.id, 'cancelado')}>
                        Cancelar
                      </button>
                    </>
                  )}
                  {a.estado === 'aceptado' && (
                    <>
                      <button className="admin-btn-accion admin-btn-accion-recogido" disabled={cargandoEste}
                        onClick={() => cambiarEstado(a.id, 'recogido')}>
                        Marcar recogido
                      </button>
                      <button className="admin-btn-accion admin-btn-accion-cancel" disabled={cargandoEste}
                        onClick={() => cambiarEstado(a.id, 'cancelado')}>
                        Cancelar
                      </button>
                    </>
                  )}
                  {(a.estado === 'recogido' || a.estado === 'retrasado') && (
                    <button className="admin-btn-accion admin-btn-accion-complete" disabled={cargandoEste}
                      onClick={() => cambiarEstado(a.id, 'completado')}>
                      Completar
                    </button>
                  )}
                  {a.estado === 'expirado' && (
                    <>
                      <button className="admin-btn-accion admin-btn-accion-recogido" disabled={cargandoEste}
                        onClick={() => cambiarEstado(a.id, 'recogido')}>
                        Marcar recogido
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}

          {listaOrdenada.length === 0 && (
            <p className="admin-vacio" style={{ padding: '1em 0' }}>No hay alquileres con ese filtro.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ===== SECCION PRODUCTOS =====
function SeccionProductos() {
  const navigate = useNavigate()

  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [epocas, setEpocas] = useState([])
  const [paises, setPaises] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [cambiando, setCambiando] = useState(null)
  const [listaFiltrada, setListaFiltrada] = useState(null)

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroDestacado, setFiltroDestacado] = useState('')
  const [filtroReserva, setFiltroReserva] = useState('')
  const [filtroAlquiler, setFiltroAlquiler] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroSubcategoria, setFiltroSubcategoria] = useState('')
  const [filtroPais, setFiltroPais] = useState('')
  const [filtroEpoca, setFiltroEpoca] = useState('')
  const [filtroMateriales, setFiltroMateriales] = useState('')
  const [filtroMedidas, setFiltroMedidas] = useState('')
  const [filtroDescripcion, setFiltroDescripcion] = useState('')

  // Orden
  const [orden, setOrden] = useState({ col: 'id', dir: 'asc' })

  // Carga 4 recursos en paralelo con Promise.all:
  // productos, categorías (con sus subcategorías), épocas y países.
  // Esto es para rellenar todos los selects de filtro sin peticiones encadenadas
  const cargar = () => {
    setCargando(true)
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/productos`, { headers: headers() }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/categorias`, { headers: headers() }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/epocas`, { headers: headers() }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/paises`, { headers: headers() }).then(r => r.json()),
    ]).then(([prods, cats, eps, pais]) => {
      setProductos(prods)
      setCategorias(cats)
      setEpocas(eps)
      setPaises(pais)
      setCargando(false)
    }).catch(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  const msg = (ok, txt) => { ok ? setExito(txt) : setError(txt); setTimeout(() => { setExito(''); setError('') }, 3000) }

  const cambiarOrden = (col) => {
    setOrden(prev => {
      const nuevoDir = prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc'
      return { col, dir: nuevoDir }
    })
  }

  const icono = (col) => orden.col === col ? (orden.dir === 'asc' ? ' ↑' : ' ↓') : ''

  // Elimina un producto tras confirmación. También elimina sus imágenes del storage
  // (lo gestiona el backend). Mientras se procesa, deshabilita los botones de esa fila
  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    setCambiando(id)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/productos/${id}`, { method: 'DELETE', headers: headers() })
      const data = await res.json()
      if (!res.ok) return msg(false, data.mensaje || 'Error al eliminar')
      cargar(); msg(true, 'Producto eliminado')
    } catch { msg(false, 'Error de conexión') }
    finally { setCambiando(null) }
  }

  // Avanza el estado del producto al siguiente en el ciclo: disponible → reservado → alquilado → inactivo → disponible.
  // Calcula el siguiente estado con el índice actual en el array y el operador módulo (%)
  // para que al llegar al final vuelva al principio
  const cambiarEstado = async (id, estadoActual) => {
    const estados = ['disponible', 'reservado', 'alquilado', 'inactivo']
    const idx = estados.indexOf(estadoActual)
    const siguiente = estados[(idx + 1) % estados.length]
    if (!confirm(`¿Cambiar estado a "${siguiente}"?`)) return
    setCambiando(id)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/productos/${id}`, {
        method: 'PUT', headers: headers(), body: JSON.stringify({ estado: siguiente })
      })
      const data = await res.json()
      if (!res.ok) return msg(false, data.mensaje || 'Error al cambiar estado')
      cargar(); msg(true, 'Estado actualizado')
    } catch { msg(false, 'Error de conexión') }
    finally { setCambiando(null) }
  }

  // Calcula las subcategorías disponibles para el select de filtro de subcategoría.
  // Si hay una categoría seleccionada muestra solo sus subcategorías
  // si no, muestra todas las subcategorías de todas las categorías
  const subcategoriasFiltro = filtroCategoria
    ? (categorias.find(c => c.id === parseInt(filtroCategoria))?.subcategorias || [])
    : categorias.flatMap(c => c.subcategorias || [])

  // Aplica todos los filtros activos sobre la lista completa de productos.
  // Es la sección con más filtros: estado, destacado, reserva, alquiler, categoría,
  // subcategoría, país, época, materiales, medidas y descripción.
  // Para los booleanos (destacado, reserva, alquiler) filtra directamente por el valor truthy.
  // Para las relaciones (categoría, subcategoría, país, época) compara los IDs como enteros.
  // Para los campos de texto opcionales (materiales, medidas, descripción) comprueba si son null o vacíos
  const buscar = () => {
    let lista = [...productos]
    if (filtroEstado) lista = lista.filter(p => p.estado === filtroEstado)
    if (filtroDestacado === 'si') lista = lista.filter(p => p.destacado)
    if (filtroDestacado === 'no') lista = lista.filter(p => !p.destacado)
    if (filtroReserva === 'si') lista = lista.filter(p => p.permite_reserva)
    if (filtroReserva === 'no') lista = lista.filter(p => !p.permite_reserva)
    if (filtroAlquiler === 'si') lista = lista.filter(p => p.permite_alquiler)
    if (filtroAlquiler === 'no') lista = lista.filter(p => !p.permite_alquiler)
    if (filtroCategoria) lista = lista.filter(p => p.subcategoria?.categoria?.id === parseInt(filtroCategoria))
    if (filtroSubcategoria) lista = lista.filter(p => p.subcategoria_id === parseInt(filtroSubcategoria))
    if (filtroPais) lista = lista.filter(p => p.pais_id === parseInt(filtroPais))
    if (filtroEpoca) lista = lista.filter(p => p.epoca_id === parseInt(filtroEpoca))
    if (filtroMateriales === 'si') lista = lista.filter(p => p.materiales && p.materiales.trim() !== '')
    if (filtroMateriales === 'no') lista = lista.filter(p => !p.materiales || p.materiales.trim() === '')
    if (filtroMedidas === 'si') lista = lista.filter(p => p.medidas && p.medidas.trim() !== '')
    if (filtroMedidas === 'no') lista = lista.filter(p => !p.medidas || p.medidas.trim() === '')
    if (filtroDescripcion === 'si') lista = lista.filter(p => p.descripcion && p.descripcion.trim() !== '')
    if (filtroDescripcion === 'no') lista = lista.filter(p => !p.descripcion || p.descripcion.trim() === '')
    setListaFiltrada(lista)
  }

  const limpiar = () => {
    setFiltroEstado(''); setFiltroDestacado(''); setFiltroReserva(''); setFiltroAlquiler('')
    setFiltroCategoria(''); setFiltroSubcategoria(''); setFiltroPais(''); setFiltroEpoca('')
    setFiltroMateriales(''); setFiltroMedidas(''); setFiltroDescripcion('')
    setListaFiltrada(null)
  }

  // Ordena la lista según la columna activa. A diferencia de reservas y alquileres,
  // aquí se ordenan también por id (numérico) y precio (parseFloat para evitar comparación como string),
  // y para categoría y subcategoría accede a relaciones anidadas en dos niveles
  const listaBase = listaFiltrada || productos
  const listaOrdenada = [...listaBase].sort((a, b) => {
    const { col, dir } = orden
    let va, vb
    if (col === 'id') { va = a.id; vb = b.id }
    else if (col === 'nombre') { va = a.nombre || ''; vb = b.nombre || '' }
    else if (col === 'precio') { va = parseFloat(a.precio) || 0; vb = parseFloat(b.precio) || 0 }
    else if (col === 'estado') { va = a.estado || ''; vb = b.estado || '' }
    else if (col === 'categoria') { va = a.subcategoria?.categoria?.nombre || ''; vb = b.subcategoria?.categoria?.nombre || '' }
    else if (col === 'subcategoria') { va = a.subcategoria?.nombre || ''; vb = b.subcategoria?.nombre || '' }
    else { va = ''; vb = '' }
    if (typeof va === 'string') return dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    return dir === 'asc' ? va - vb : vb - va
  })

  // Colores para los badges de estado de producto.
  const COLORES_ESTADO_P = {
    disponible: { color: '#27ae60', bg: '#eafaf1' },
    reservado: { color: '#C08552', bg: '#FDF6EF' },
    alquilado: { color: '#2f979e', bg: '#eaf8fb' },
    inactivo: { color: '#888', bg: '#f5f5f5' },
  }

  // Celda de cabecera de tabla clicable que ordena por la columna indicada,
  // mostrando el icono de dirección si es la columna activa
  const thS = (col, label) => (
    <span className="admin-tabla-th admin-th-rv admin-tabla-th-sortable" onClick={() => cambiarOrden(col)}>
      {label}{icono(col)}
    </span>
  )

  return (
    <div className="admin-seccion">
      <h2 className="admin-seccion-titulo">Productos</h2>

      {exito && <p className="admin-exito">{exito}</p>}
      {error && <p className="admin-error">{error}</p>}

      {/* FILTROS */}
      <div className="admin-filtros">
        <p className="admin-filtros-titulo">Filtros</p>
        <div className="admin-filtros-grid admin-filtros-grid-prod">

          <div className="admin-filtros-fila">
            <label className="admin-label">Estado:</label>
            <select className="admin-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="alquilado">Alquilado</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="admin-filtros-fila">
            <label className="admin-label">Destacado:</label>
            <select className="admin-select" value={filtroDestacado} onChange={e => setFiltroDestacado(e.target.value)}>
              <option value="">Todos</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="admin-filtros-fila">
            <label className="admin-label">Permite reserva:</label>
            <select className="admin-select" value={filtroReserva} onChange={e => setFiltroReserva(e.target.value)}>
              <option value="">Todos</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="admin-filtros-fila">
            <label className="admin-label">Permite alquiler:</label>
            <select className="admin-select" value={filtroAlquiler} onChange={e => setFiltroAlquiler(e.target.value)}>
              <option value="">Todos</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="admin-filtros-fila">
            <label className="admin-label">Categoría:</label>
            <select className="admin-select" value={filtroCategoria} onChange={e => { setFiltroCategoria(e.target.value); setFiltroSubcategoria('') }}>
              <option value="">Todas</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          <div className="admin-filtros-fila">
            <label className="admin-label">Subcategoría:</label>
            <select className="admin-select" value={filtroSubcategoria} onChange={e => setFiltroSubcategoria(e.target.value)}>
              <option value="">Todas</option>
              {subcategoriasFiltro.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>

          <div className="admin-filtros-fila">
            <label className="admin-label">País:</label>
            <select className="admin-select" value={filtroPais} onChange={e => setFiltroPais(e.target.value)}>
              <option value="">Todos</option>
              {paises.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>

          <div className="admin-filtros-fila">
            <label className="admin-label">Época:</label>
            <select className="admin-select" value={filtroEpoca} onChange={e => setFiltroEpoca(e.target.value)}>
              <option value="">Todas</option>
              {epocas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>

          <div className="admin-filtros-fila">
            <label className="admin-label">Tiene materiales:</label>
            <select className="admin-select" value={filtroMateriales} onChange={e => setFiltroMateriales(e.target.value)}>
              <option value="">Todos</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="admin-filtros-fila">
            <label className="admin-label">Tiene medidas:</label>
            <select className="admin-select" value={filtroMedidas} onChange={e => setFiltroMedidas(e.target.value)}>
              <option value="">Todos</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="admin-filtros-fila">
            <label className="admin-label">Tiene descripción:</label>
            <select className="admin-select" value={filtroDescripcion} onChange={e => setFiltroDescripcion(e.target.value)}>
              <option value="">Todos</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

        </div>
        <div className="admin-filtros-botones">
          <button className="admin-btn-add" onClick={buscar}>Buscar</button>
          <button className="admin-btn-limpiar" onClick={limpiar}>Limpiar</button>
        </div>
      </div>

      <button className="admin-prod-add" onClick={() => navigate('/admin/producto/nuevo')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        Nuevo producto
      </button>

      {/* ORDENAR EN MÓVIL */}
      <div className="admin-ordenar-wrapper admin-ordenar-movil">
        <label className="admin-label">Ordenar por:</label>
        <select className="admin-select" value={`${orden.col}-${orden.dir}`}
          onChange={e => {
            const [col, dir] = e.target.value.split('-')
            setOrden({ col, dir })
          }}>
          <option value="id-asc">ID menor a mayor</option>
          <option value="id-desc">ID mayor a menor</option>
          <option value="nombre-asc">Nombre A→Z</option>
          <option value="nombre-desc">Nombre Z→A</option>
          <option value="precio-asc">Precio menor a mayor</option>
          <option value="precio-desc">Precio mayor a menor</option>
          <option value="estado-asc">Estado A→Z</option>
          <option value="estado-desc">Estado Z→A</option>
          <option value="categoria-asc">Categoría A→Z</option>
          <option value="categoria-desc">Categoría Z→A</option>
          <option value="subcategoria-asc">Subcategoría A→Z</option>
          <option value="subcategoria-desc">Subcategoría Z→A</option>
        </select>
      </div>

      {/* TABLA */}
      {cargando ? <p className="admin-cargando">Cargando...</p> : (
        <div className="admin-tabla-wrapper admin-tabla-wrapper-prod">
          <div className="admin-tabla-header admin-tabla-header-prod">
            {thS('id', 'ID')}
            {thS('nombre', 'Nombre')}
            <span className="admin-tabla-th admin-th-rv">Descripción</span>
            {thS('precio', 'Precio')}
            {thS('estado', 'Estado')}
            <span className="admin-tabla-th admin-th-rv">Dest.</span>
            <span className="admin-tabla-th admin-th-rv">Reserva</span>
            <span className="admin-tabla-th admin-th-rv">Alquiler</span>
            {thS('categoria', 'Categoría')}
            {thS('subcategoria', 'Subcategoría')}
            <span className="admin-tabla-th admin-th-rv">País</span>
            <span className="admin-tabla-th admin-th-rv">Época</span>
            <span className="admin-tabla-th admin-th-rv">Medidas</span>
            <span className="admin-tabla-th admin-th-rv">Materiales</span>
            <span className="admin-tabla-th admin-th-rv admin-th-rv-acciones">Acciones</span>
          </div>
          {listaOrdenada.map(p => {
            const colEstado = COLORES_ESTADO_P[p.estado] || { color: '#888', bg: '#f5f5f5' }
            const cargandoEste = cambiando === p.id
            return (
              <div key={p.id} className="admin-item admin-item-prod">
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">ID:</span>
                  {p.id}
                </span>
                <span className="admin-cell-rv admin-cell-prod-nombre">
                  <span className="admin-cell-label">Nombre:</span>
                  {p.nombre}
                </span>
                <span className="admin-cell-rv admin-cell-prod-desc">
                  <span className="admin-cell-label">Descripción:</span>
                  <span className="admin-cell-truncate">{p.descripcion || '—'}</span>
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Precio:</span>
                  {p.precio != null ? `${parseFloat(p.precio).toFixed(2)} €` : '—'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Estado:</span>
                  <span className="admin-estado-badge" style={{ color: colEstado.color, background: colEstado.bg }}>
                    {p.estado ? p.estado.charAt(0).toUpperCase() + p.estado.slice(1) : '—'}
                  </span>
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Destacado:</span>
                  {p.destacado ? 'Sí' : 'No'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Reserva:</span>
                  {p.permite_reserva ? 'Sí' : 'No'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Alquiler:</span>
                  {p.permite_alquiler ? 'Sí' : 'No'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Categoría:</span>
                  {p.subcategoria?.categoria?.nombre || '—'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Subcategoría:</span>
                  {p.subcategoria?.nombre || '—'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">País:</span>
                  {p.pais?.nombre || '—'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Época:</span>
                  {p.epoca?.nombre || '—'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Medidas:</span>
                  {p.medidas || '—'}
                </span>
                <span className="admin-cell-rv">
                  <span className="admin-cell-label">Materiales:</span>
                  {p.materiales || '—'}
                </span>
                <div className="admin-cell-rv admin-cell-rv-acciones">
                  <button className="admin-btn-edit" onClick={() => navigate(`/admin/producto/${p.id}`)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Editar
                  </button>
                  <button className="admin-btn-delete" disabled={cargandoEste}
                    onClick={() => eliminar(p.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            )
          })}

          {listaOrdenada.length === 0 && (
            <p className="admin-vacio" style={{ padding: '1em 0' }}>No hay productos con ese filtro.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ===== COMPONENTE PRINCIPAL =====
export default function Admin() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  // Sección activa del panel, por defecto muestra productos
  const [seccion, setSeccion] = useState('productos')

  // Protección de ruta: si no hay usuario redirige al login,
  // si hay usuario pero no es admin redirige al inicio
  useEffect(() => {
    if (!usuario) navigate('/login?redirect=/admin')
    else if (usuario.rol !== 'admin') navigate('/')
  }, [usuario])

  // Mientras se resuelve la redirección no renderiza nada
  if (!usuario || usuario.rol !== 'admin') return null

  // Definición de los items del sidebar: cada uno tiene una clave única,
  // una etiqueta y el path SVG de su icono. La clave coincide con el nombre
  // de la sección que se renderiza en el contenido principal
  const navItems = [
    { key: 'reservas', label: 'Reservas', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /> },
    { key: 'alquileres', label: 'Alquileres', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /> },
    { key: 'productos', label: 'Productos', icon: <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /> },
    { key: 'categorias', label: 'Categorías', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /> },
    { key: 'epocas', label: 'Épocas', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /> },
    { key: 'paises', label: 'Países', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3.284 14.253A8.959 8.959 0 0 1 3 12c0-1.455.346-2.827.957-4.036" /> },
    { key: 'usuarios', label: 'Usuarios', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /> },
  ]

  return (
    <div className="admin-page">
      <div className="admin-cabecera">
        <h1 className="admin-titulo">Panel de administración</h1>
        {/* Muestra el nombre y email del admin logueado */}
        <p className="admin-subtitulo">{usuario.name} · {usuario.email}</p>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          {navItems.map(({ key, label, icon }) => (
            <button key={key}
              className={`admin-nav-item ${seccion === key ? 'admin-nav-activo' : ''}`}
              onClick={() => setSeccion(key)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{icon}</svg>
              {label}
            </button>
          ))}
        </aside>

        {/* Contenido principal: renderiza el componente correspondiente
            a la sección activa usando renderizado condicional */}
        <div className="admin-contenido">
          {seccion === 'reservas' && <SeccionReservas />}
          {seccion === 'alquileres' && <SeccionAlquileres />}
          {seccion === 'productos' && <SeccionProductos />}
          {seccion === 'usuarios' && <SeccionUsuarios />}
          {seccion === 'categorias' && <SeccionCategorias />}
          {seccion === 'epocas' && <SeccionEpocas />}
          {seccion === 'paises' && <SeccionPaises />}
        </div>
      </div>
    </div>
  )
}
