import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminProductoForm.css'
import { getImagenUrl } from '../utils/imagen'

const token = () => localStorage.getItem('token')
const authHeaders = () => ({
  'Authorization': `Bearer ${token()}`,
  'Accept': 'application/json',
})

export default function AdminProductoForm() {
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const navigate = useNavigate()
  const { usuario } = useAuth()

  // datos del formulario
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    estado: 'disponible',
    destacado: false,
    permite_reserva: false,
    permite_alquiler: false,
    subcategoria_id: '',
    pais_id: '',
    epoca_id: '',
    medidas: '',
    materiales: '',
  })

  // listas para selects
  const [categorias, setCategorias] = useState([])
  const [epocas, setEpocas] = useState([])
  const [paises, setPaises] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')

  // imágenes
  const [imagenesExistentes, setImagenesExistentes] = useState([]) // las del servidor
  const [imagenesAEliminar, setImagenesAEliminar] = useState([])   // ids a borrar
  const [imagenesNuevas, setImagenesNuevas] = useState([])          // File[]
  const [previsualizaciones, setPrevisualizaciones] = useState([])  // URLs locales

  // estado UI
  const [cargando, setCargando] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  // redirigir si no es admin
  useEffect(() => {
    if (!usuario) navigate('/login')
    else if (usuario.rol !== 'admin') navigate('/')
  }, [usuario])

  // cargar selects
  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/categorias`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/epocas`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/paises`, { headers: authHeaders() }).then(r => r.json()),
    ]).then(([cats, eps, pais]) => {
      setCategorias(cats)
      setEpocas(eps)
      setPaises(pais)
    })
  }, [])

  // cargar producto si es edición
  useEffect(() => {
    if (!esEdicion) return
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/productos/${id}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(p => {
        setForm({
          nombre: p.nombre || '',
          descripcion: p.descripcion || '',
          precio: p.precio ?? '',
          estado: p.estado || 'disponible',
          destacado: Boolean(p.destacado),
          permite_reserva: Boolean(p.permite_reserva),
          permite_alquiler: Boolean(p.permite_alquiler),
          subcategoria_id: p.subcategoria_id || '',
          pais_id: p.pais_id || '',
          epoca_id: p.epoca_id || '',
          medidas: p.medidas || '',
          materiales: p.materiales || '',
        })
        if (p.subcategoria?.categoria_id) setCategoriaSeleccionada(String(p.subcategoria.categoria_id))
        else if (p.subcategoria?.categoria?.id) setCategoriaSeleccionada(String(p.subcategoria.categoria.id))
        setImagenesExistentes(p.imagenes || [])
        setCargando(false)
      })
      .catch(() => { setError('Error al cargar el producto'); setCargando(false) })
  }, [id])

  // subcategorías según categoría seleccionada
  const subcategorias = categoriaSeleccionada
    ? (categorias.find(c => c.id === parseInt(categoriaSeleccionada))?.subcategorias || [])
    : []

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value)
    setForm(prev => ({ ...prev, subcategoria_id: '' }))
  }

  // añadir imagen nueva
  const handleAnadirImagen = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImagenesNuevas(prev => [...prev, file])
    setPrevisualizaciones(prev => [...prev, URL.createObjectURL(file)])
    e.target.value = '' // reset input
  }

  // quitar imagen nueva (antes de guardar)
  const handleQuitarNueva = (idx) => {
    URL.revokeObjectURL(previsualizaciones[idx])
    setImagenesNuevas(prev => prev.filter((_, i) => i !== idx))
    setPrevisualizaciones(prev => prev.filter((_, i) => i !== idx))
  }

  // marcar imagen existente para eliminar
  const handleMarcarEliminar = (imagenId) => {
    setImagenesAEliminar(prev =>
      prev.includes(imagenId) ? prev.filter(i => i !== imagenId) : [...prev, imagenId]
    )
  }

  // guardar producto (crear o actualizar)
  const handleGuardar = async () => {
    if (!form.nombre.trim()) return setError('El nombre es obligatorio')
    if (!form.subcategoria_id) return setError('La subcategoría es obligatoria')

    setGuardando(true)
    setError('')

    try {
      // 1. Guardar datos + nuevas imágenes con multipart/form-data
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) {
          formData.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : v)
        }
      })
      imagenesNuevas.forEach(img => formData.append('imagenes[]', img))

      const url = esEdicion
        ? `${import.meta.env.VITE_API_URL}/api/admin/productos/${id}`
        : `${import.meta.env.VITE_API_URL}/api/admin/productos`


      if (esEdicion) formData.append('_method', 'PUT') // laravel necesita _method para PUT con multipart

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token()}`, 'Accept': 'application/json' },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) return setError(data.message || data.mensaje || 'Error al guardar')

      // 2. Eliminar imágenes marcadas
      await Promise.all(imagenesAEliminar.map(imgId =>
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/imagenes/${imgId}`, {
          method: 'DELETE',
          headers: authHeaders(),
        })
      ))

      setExito(esEdicion ? 'Producto actualizado correctamente' : 'Producto creado correctamente')
      setTimeout(() => navigate('/admin'), 1500)
    } catch {
      setError('Error de conexión')
    } finally {
      setGuardando(false)
    }
  }

  // cambiar imagen principal
  const handleCambiarPrincipal = async (imagenId) => {
    if (!esEdicion) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/productos/${id}/imagen-principal`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagen_id: imagenId })
      })
      if (!res.ok) return setError('Error al cambiar imagen principal')
      setImagenesExistentes(prev => prev.map(img => ({
        ...img,
        es_principal: img.id === imagenId
      })))
      setExito('Imagen principal actualizada')
      setTimeout(() => setExito(''), 2000)
    } catch { setError('Error de conexión') }
  }


  if (!usuario || usuario.rol !== 'admin') return null // protección extra por si el useEffect no redirige a tiempo
  if (cargando) return <div className="apf-page"><p className="apf-cargando">Cargando...</p></div> // mostrar texto cargando mientras carga

  const imagenesVisibles = imagenesExistentes.filter(img => !imagenesAEliminar.includes(img.id)) // imágenes que se muestran (no eliminadas)
  const tienePrincipal = imagenesVisibles.some(img => img.es_principal) // si alguna imagen es principal 
  const imagenPrincipal = imagenesVisibles.find(img => img.es_principal) || imagenesVisibles[0] // la principal a mostrar (la que está marcada o la primera visible)

  return (
    <div className="apf-page">
      <div className="apf-cabecera">
        <button className="apf-btn-volver" onClick={() => navigate('/admin')}>
          ← Volver al panel
        </button>
        <h1 className="apf-titulo">{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h1>
      </div>

      {error && <p className="apf-error">{error}</p>}
      {exito && <p className="apf-exito">{exito}</p>}

      <div className="apf-layout">

        {/* COLUMNA IZQUIERDA: IMÁGENES */}
        <div className="apf-col-imagenes">
          <h2 className="apf-subtitulo">Imágenes</h2>

          {/* Imagen principal */}
          <div className="apf-imagen-principal">
            {imagenPrincipal ? (
              <img src={getImagenUrl(imagenPrincipal.url)} alt="Principal" className="apf-img-principal" />
            ) : previsualizaciones.length > 0 ? (
              <img src={previsualizaciones[0]} alt="Principal" className="apf-img-principal" />
            ) : (
              <div className="apf-img-vacia">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Sin imagen</span>
              </div>
            )}
            {imagenesVisibles.length > 0 && <span className="apf-badge-principal">Principal</span>}
          </div>

          {/* Galería de imágenes existentes */}
          {imagenesVisibles.length > 0 && (
            <div className="apf-galeria">
              {imagenesVisibles.map(img => (
                <div key={img.id} className={`apf-thumb ${imagenesAEliminar.includes(img.id) ? 'apf-thumb-eliminar' : ''} ${img.es_principal ? 'apf-thumb-principal' : ''}`}>
                  <img src={getImagenUrl(img.url)} alt="" />
                  {img.es_principal && <span className="apf-thumb-badge">✓</span>}
                  {!img.es_principal && !imagenesAEliminar.includes(img.id) && esEdicion && (
                    <button className="apf-thumb-btn-principal" onClick={() => handleCambiarPrincipal(img.id)} title="Marcar como principal">
                      ★
                    </button>
                  )}
                  <button className="apf-thumb-btn-eliminar" onClick={() => handleMarcarEliminar(img.id)} title="Eliminar imagen">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Previsualizaciones de nuevas imágenes */}
          {previsualizaciones.length > 0 && (
            <div className="apf-galeria">
              {previsualizaciones.map((url, idx) => (
                <div key={idx} className="apf-thumb apf-thumb-nueva">
                  <img src={url} alt="" />
                  {!tienePrincipal && idx === 0 && <span className="apf-thumb-badge">✓</span>}
                  <button className="apf-thumb-btn-eliminar" onClick={() => handleQuitarNueva(idx)} title="Quitar imagen">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Botón añadir imagen */}
          <label className="apf-btn-anadir-imagen">
            + Añadir imagen
            <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleAnadirImagen} style={{ display: 'none' }} />
          </label>

          {imagenesAEliminar.length > 0 && (
            <p className="apf-aviso-eliminar">
              {imagenesAEliminar.length} imagen{imagenesAEliminar.length > 1 ? 'es' : ''} se eliminar{imagenesAEliminar.length > 1 ? 'án' : 'á'} al guardar
            </p>
          )}
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="apf-col-form">
          <h2 className="apf-subtitulo">Datos del producto</h2>

          <div className="apf-form">

            <div className="apf-field">
              <label className="apf-label">Nombre *</label>
              <input className="apf-input" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del producto" />
            </div>

            <div className="apf-field">
              <label className="apf-label">Descripción</label>
              <textarea className="apf-textarea" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción del producto" rows={4} />
            </div>

            <div className="apf-fila-2">
              <div className="apf-field">
                <label className="apf-label">Precio (€)</label>
                <input className="apf-input" name="precio" type="number" min="0" step="0.01" value={form.precio} onChange={handleChange} placeholder="0.00" />
              </div>
              <div className="apf-field">
                <label className="apf-label">Estado</label>
                <select className="apf-select" name="estado" value={form.estado} onChange={handleChange}>
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="alquilado">Alquilado</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="apf-fila-2">
              <div className="apf-field">
                <label className="apf-label">Categoría *</label>
                <select className="apf-select" value={categoriaSeleccionada} onChange={handleCategoriaChange}>
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="apf-field">
                <label className="apf-label">Subcategoría *</label>
                <select className="apf-select" name="subcategoria_id" value={form.subcategoria_id} onChange={handleChange} disabled={!categoriaSeleccionada}>
                  <option value="">Seleccionar subcategoría</option>
                  {subcategorias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </div>
            </div>

            <div className="apf-fila-2">
              <div className="apf-field">
                <label className="apf-label">País de origen</label>
                <select className="apf-select" name="pais_id" value={form.pais_id} onChange={handleChange}>
                  <option value="">Sin especificar</option>
                  {paises.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div className="apf-field">
                <label className="apf-label">Época</label>
                <select className="apf-select" name="epoca_id" value={form.epoca_id} onChange={handleChange}>
                  <option value="">Sin especificar</option>
                  {epocas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </div>
            </div>

            <div className="apf-field">
              <label className="apf-label">Medidas</label>
              <input className="apf-input" name="medidas" value={form.medidas} onChange={handleChange} placeholder="Ej: 50cm x 30cm x 20cm" />
            </div>

            <div className="apf-field">
              <label className="apf-label">Materiales</label>
              <input className="apf-input" name="materiales" value={form.materiales} onChange={handleChange} placeholder="Ej: Madera de roble, latón" />
            </div>

            {/* Checkboxes */}
            <div className="apf-checkboxes">
              <label className="apf-checkbox-label">
                <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} />
                <span>Producto destacado</span>
              </label>
              <label className="apf-checkbox-label">
                <input type="checkbox" name="permite_reserva" checked={form.permite_reserva} onChange={handleChange} />
                <span>Permite reserva</span>
              </label>
              <label className="apf-checkbox-label">
                <input type="checkbox" name="permite_alquiler" checked={form.permite_alquiler} onChange={handleChange} />
                <span>Permite alquiler</span>
              </label>
            </div>

          </div>

          {/* Botones */}
          <div className="apf-botones">
            <button className="apf-btn-guardar" onClick={handleGuardar} disabled={guardando}>
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
            </button>
            <button className="apf-btn-cancelar" onClick={() => navigate('/admin')} disabled={guardando}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
