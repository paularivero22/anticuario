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
            <p className="contacto-dato">CA-303, 8</p>
            <p className="contacto-dato-sub">Mortera, Cantabria</p>
            <a
              href="https://maps.app.goo.gl/Fznr3DhbTT1CdKJq8"
              target="_blank"
              rel="noopener noreferrer"
              className="link-google-maps"
            >
              Ver en Google Maps
            </a>
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

        {/* ===== MAPA E IMÁGENES ===== */}
        <div className="contacto-mapa-wrapper">
          <iframe
            className="contacto-mapa"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d486.34794443289286!2d-3.927970892441722!3d43.44492161725503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses!2ses!4v1780472443145!5m2!1ses!2ses"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Antigüedades Mortera"
          />
          <div className="contacto-imagen-wrapper">
            <img
              src="/imagenes/contacto.webp"
              alt="Antigüedades Mortera"
              className="contacto-imagen"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
