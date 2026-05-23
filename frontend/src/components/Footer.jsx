import './Footer.css'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
    const navigate = useNavigate()

    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-col">
                    <h4>Ayuda</h4>
                    <span className="footer-link">FAQ</span>
                    {/* <span className="footer-link">Guía de resevas</span>
                    <span className="footer-link">Guía de alquileres</span> */}
                    <span className="footer-link" onClick={() => navigate('/contacto')}>Contactar</span>
                </div>
                <div className="footer-col">
                    <h4>Información</h4>
                    <span className="footer-link">Aviso Legal</span>
                    <span className="footer-link">Política de Privacidad</span>
                    <span className="footer-link">Política de cookies</span>
                </div>
                <div className="footer-col">
                    <h4>Nosotros</h4>
                    <div className="footer-contact-row">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0121.92 15z" /></svg>
                        <span className="footer-link footer-link-inline">626 11 15 56</span>
                    </div>
                    <div className="footer-contact-row">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                        <span className="footer-link footer-link-inline">antiguedadesmortera@gmail.com</span>
                    </div>
                    <div className="footer-social">
                        <svg className="footer-social-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5">
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                        <a href="https://www.facebook.com/p/Antiguedades-Mortera-100062927363949" target="_blank" rel="noopener noreferrer" className="footer-link footer-link-inline">Facebook</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p className="footer-copy">© 2026 Antigüedades Mortera. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}
