import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirect = searchParams.get('redirect') || '/'

    const { login } = useAuth()

    const [form, setForm] = useState({ email: '', password: '' }) // estado para manejar el formulario
    const [error, setError] = useState('') // estado para manejar errores de autenticación
    const [cargando, setCargando] = useState(false)

    // Limpiar el error al cambiar cualquier campo del formulario
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        setError('')

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(form)
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Credenciales incorrectas')
                return
            }

            login(data.token, data.user)
            navigate(redirect)

        } catch (err) {
            setError('Error de conexión. Inténtalo de nuevo.')
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <p className="auth-eyebrow">Bienvenido de nuevo</p>
                <h1 className="auth-titulo">Iniciar sesión</h1>

                {error && <p className="auth-error">{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label className="auth-label">Correo electrónico</label>
                        <input
                            className="auth-input"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Contraseña</label>
                        <input
                            className="auth-input"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button className="btn-primary auth-submit" type="submit" disabled={cargando}>
                        {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>

                <p className="auth-footer-text">
                    ¿No tienes cuenta?{' '}
                    <Link to="/registro" className="auth-link">Regístrate</Link>
                </p>
            </div>
        </div>
    )
}
