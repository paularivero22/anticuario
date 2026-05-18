import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [cargando, setCargando] = useState(true)

    // al cargar la app comprueba si hay sesion guardada
    useEffect(() => {
        const token = localStorage.getItem('token')
        const usuarioGuardado = localStorage.getItem('usuario')
        if (token && usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado))
        }
        setCargando(false)
    }, [])

    const login = (token, userData) => {
        localStorage.setItem('token', token)
        localStorage.setItem('usuario', JSON.stringify(userData))
        setUsuario(userData)
    }

    const logout = () => {
        
        // limpia inmediatamente sin esperar al servidor
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        setUsuario(null)
        window.location.href = '/'

        // llama al servidor en segundo plano para invalidar el token
        fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json',
            }
        }).catch(() => { })
    }

    const actualizarUsuario = (nuevosDatos) => {
        const usuarioActualizado = { ...usuario, ...nuevosDatos }
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado))
        setUsuario(usuarioActualizado)
    }

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando, actualizarUsuario }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
