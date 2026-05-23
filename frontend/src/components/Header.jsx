import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

export default function Header() {
    const [submenuAbierto, setSubmenuAbierto] = useState(false)
    const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
    const [categoriaMovilAbierta, setCategoriaMovilAbierta] = useState(false)
    const [usuarioMenuAbierto, setUsuarioMenuAbierto] = useState(false)
    const [categorias, setCategorias] = useState([])
    const navigate = useNavigate()
    const { usuario, logout } = useAuth()
    const usuarioMenuRef = useRef(null)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/categorias`)
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error('Error al cargar categorías:', err))
    }, [])

    // cerrar menu usuario al hacer click fuera
    useEffect(() => {
        const handleClickFuera = (e) => {
            if (usuarioMenuRef.current && !usuarioMenuRef.current.contains(e.target)) {
                setUsuarioMenuAbierto(false)
            }
        }
        document.addEventListener('mousedown', handleClickFuera)
        return () => document.removeEventListener('mousedown', handleClickFuera)
    }, [])

    const navegarCategoria = (id) => {
        navigate(`/productos/${id}`)
        setSubmenuAbierto(false)
        setMenuMovilAbierto(false)
        setCategoriaMovilAbierta(false)
    }

    const handleLogout = () => {
        setUsuarioMenuAbierto(false)
        logout()
    }

    return (
        <div>
            {/* Banner superior */}
            <div className="header-banner">
                15% de descuento en Muebles
            </div>

            {/* Navbar */}
            <nav className="navbar">
                {/* Hamburguesa móvil */}
                <button className="navbar-hamburguesa" onClick={() => setMenuMovilAbierto(true)}>
                    <span />
                    <span />
                    <span />
                </button>

                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="navbar-logo-text"></span>
                </Link>

                {/* MENU */}
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Inicio</Link>
                    <div
                        className="navbar-submenu-wrapper"
                        onMouseEnter={() => setSubmenuAbierto(true)}
                        onMouseLeave={() => setSubmenuAbierto(false)}
                    >
                        <span className="nav-link nav-link-arrow">
                            Productos
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 4l4 4 4-4" stroke="#5E3023" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </span>
                        {submenuAbierto && (
                            <div className="submenu">
                                {categorias.map(cat => (
                                    <div
                                        key={cat.id}
                                        className="submenu-item"
                                        onClick={() => navegarCategoria(cat.id)}
                                    >
                                        {cat.nombre}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <Link to="/sobre-nosotros" className="nav-link">Sobre Nosotros</Link>
                    <Link to="/contacto" className="nav-link">Contacto</Link>
                </div>

                {/* Buscador e icono usuario */}
                <div className="navbar-actions">
                    <div className="search-box">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input className="search-input" placeholder="Buscar producto..." />
                    </div>

                    {/* Menu usuario */}
                    <div className="usuario-wrapper" ref={usuarioMenuRef}>
                        <button className="usuario-btn" onClick={() => setUsuarioMenuAbierto(!usuarioMenuAbierto)}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5E3023" strokeWidth="1.5">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </button>

                        {usuarioMenuAbierto && (
                            <div className="usuario-dropdown">
                                {usuario ? (
                                    <>
                                        <div className="usuario-nombre">{usuario.name}</div>
                                        <div className="usuario-email">{usuario.email}</div>
                                        <div className="usuario-dropdown-divider" />
                                        <Link to="/perfil" className="usuario-dropdown-item" onClick={() => setUsuarioMenuAbierto(false)}>
                                            Mi perfil
                                        </Link>
                                        {usuario.rol === 'admin' && (
                                            <>
                                                <div className="usuario-dropdown-divider" />
                                                <Link to="/admin" className="usuario-dropdown-item usuario-dropdown-admin" onClick={() => setUsuarioMenuAbierto(false)}>
                                                    Administración
                                                </Link>
                                            </>
                                        )}
                                        <div className="usuario-dropdown-divider" />
                                        <button className="usuario-dropdown-item usuario-dropdown-logout" onClick={handleLogout}>
                                            Cerrar sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="usuario-dropdown-item" onClick={() => setUsuarioMenuAbierto(false)}>
                                            Iniciar sesión
                                        </Link>
                                        <Link to="/registro" className="usuario-dropdown-item" onClick={() => setUsuarioMenuAbierto(false)}>
                                            Crear cuenta
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Overlay oscuro */}
            {menuMovilAbierto && (
                <div className="menu-movil-overlay" onClick={() => setMenuMovilAbierto(false)} />
            )}

            {/* Menu móvil lateral */}
            <div className={`menu-movil ${menuMovilAbierto ? 'menu-movil-abierto' : ''}`}>
                <div className="menu-movil-header">
                    <Link to="/" className="navbar-logo" onClick={() => setMenuMovilAbierto(false)}>
                        <span className="navbar-logo-text"></span>
                    </Link>
                    <button className="menu-movil-cerrar" onClick={() => setMenuMovilAbierto(false)}>✕</button>
                </div>

                <div className="menu-movil-links">
                    <Link to="/" className="menu-movil-link" onClick={() => setMenuMovilAbierto(false)}>
                        Inicio
                    </Link>

                    <div className="menu-movil-acordeon">
                        <div
                            className="menu-movil-link menu-movil-link-arrow"
                            onClick={() => setCategoriaMovilAbierta(!categoriaMovilAbierta)}
                        >
                            Productos
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={categoriaMovilAbierta ? 'chevron-up' : ''}>
                                <path d="M2 4l4 4 4-4" stroke="#5E3023" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        {categoriaMovilAbierta && (
                            <div className="menu-movil-categorias">
                                {categorias.map(cat => (
                                    <div
                                        key={cat.id}
                                        className="menu-movil-categoria"
                                        onClick={() => navegarCategoria(cat.id)}
                                    >
                                        {cat.nombre}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link to="/sobre-nosotros" className="menu-movil-link" onClick={() => setMenuMovilAbierto(false)}>
                        Sobre Nosotros
                    </Link>

                    <Link to="/contacto" className="menu-movil-link" onClick={() => setMenuMovilAbierto(false)}>
                        Contacto
                    </Link>
                </div>

                {/* Buscador móvil */}
                <div className="menu-movil-search">
                    <div className="search-box">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input className="search-input" placeholder="Buscar producto..." />
                    </div>
                </div>
            </div>
        </div>
    )
}
