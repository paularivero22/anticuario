import './Contacto.css'

export default function Contacto() {
  return (
    <div className="contacto-page">

      <div className="contacto-cabecera">
        <p className="contacto-eyebrow">Antigüedades Mortera</p>
        <h1 className="contacto-titulo">Contacto</h1>
      </div>

      <div className="contacto-layout">

        {/* ===== INFO ===== */}
        <div className="contacto-info">

          <div className="contacto-bloque">
            <p className="contacto-bloque-titulo">Teléfono</p>
            <a className="contacto-dato">+34 626 11 15 56</a>
          </div>

          <div className="contacto-bloque">
            <p className="contacto-bloque-titulo">Email</p>
            <a className="contacto-dato">antiguedadesmortera@gmail.com</a>
          </div>

          <div className="contacto-bloque">
            <p className="contacto-bloque-titulo">Dirección</p>
            <p className="contacto-dato">Calle Ejemplo, 00</p>
            <p className="contacto-dato-sub">Mortera, Cantabria</p>
          </div>

          <div className="contacto-bloque">
            <p className="contacto-bloque-titulo">Horarios</p>
            <p className="contacto-dato">Sábados de 9:00 a 14:00</p>
            <p className="contacto-dato-sub">Entre semana con cita previa</p>
          </div>

          <div className="contacto-bloque">
            <p className="contacto-bloque-titulo">Redes sociales</p>
            <div className="contacto-redes">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="contacto-red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
                Facebook
              </a>
            </div>
          </div>

        </div>

        {/* ===== MAPA ===== */}
        <div className="contacto-mapa-wrapper">
          <iframe
            className="contacto-mapa"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896.0!2d-3.85!3d43.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDI3JzAwLjAiTiAzwrA1MScwMC4wIlc!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Antigüedades Mortera"
          />
        </div>

      </div>
    </div>
  )
}
