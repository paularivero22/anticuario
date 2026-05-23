import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Registro() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        telefono: ''
    })
    
    const [error, setError] = useState('')
    const [errores, setErrores] = useState({})
    const [cargando, setCargando] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
        setErrores({ ...errores, [e.target.name]: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        setError('')
        setErrores({})

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(form)
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.errors) {
                    setErrores(data.errors)
                } else {
                    setError(data.message || 'Error al registrarse')
                }
                return
            }

            login(data.token, data.user)
            navigate('/')

        } catch (err) {
            setError('Error de conexión. Inténtalo de nuevo.')
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <p className="auth-eyebrow">Únete a nosotros</p>
                <h1 className="auth-titulo">Crear cuenta</h1>

                {error && <p className="auth-error">{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label className="auth-label">Nombre completo</label>
                        <input
                            className={`auth-input ${errores.name ? 'auth-input-error' : ''}`}
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                            required
                        />
                        {errores.name && <p className="auth-field-error">{errores.name[0]}</p>}
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Correo electrónico</label>
                        <input
                            className={`auth-input ${errores.email ? 'auth-input-error' : ''}`}
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            required
                        />
                        {errores.email && <p className="auth-field-error">{errores.email[0]}</p>}
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Teléfono <span className="auth-opcional">(opcional)</span></label>
                        <input
                            className={`auth-input ${errores.telefono ? 'auth-input-error' : ''}`}
                            type="tel"
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            placeholder="600 000 000"
                        />
                        {errores.telefono && <p className="auth-field-error">{errores.telefono[0]}</p>}
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Contraseña</label>
                        <input
                            className={`auth-input ${errores.password ? 'auth-input-error' : ''}`}
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Mínimo 8 caracteres"
                            required
                        />
                        {errores.password && <p className="auth-field-error">{errores.password[0]}</p>}
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Confirmar contraseña</label>
                        <input
                            className={`auth-input ${errores.password_confirmation ? 'auth-input-error' : ''}`}
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            placeholder="Repite la contraseña"
                            required
                        />
                        {errores.password_confirmation && <p className="auth-field-error">{errores.password_confirmation[0]}</p>}
                    </div>

                    <button className="btn-primary auth-submit" type="submit" disabled={cargando}>
                        {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className="auth-footer-text">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="auth-link">Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}
