import './SobreNosotros.css'

export default function SobreNosotros() {
    return (
        <div className="sn-page">

            {/* CABECERA */}
            <div className="sn-cabecera">
                <p className="sn-subtitulo">Mortera, Cantabria</p>
                <h1 className="sn-titulo">Nuestra historia</h1>
                <div className="sn-linea" />
            </div>

            {/* BLOQUE 1: texto + foto */}
            <div className="sn-bloque sn-bloque-derecha">
                <div className="sn-texto">
                    <p>
                        Nuestra historia comienza en una vivienda de indianos construida en 1872 y
                        situada en Mortera, testimonio vivo de una época y de unas personas que
                        cruzaron el océano en busca de una vida mejor.
                    </p>
                    
                    <p>
                        En 1987, nuestra familia tuvo la suerte de adquirir esta casa, que con el
                        tiempo se convirtió en nuestro hogar y en el corazón de nuestro negocio.
                    </p>
                </div>
                <div className="sn-foto-wrapper">
                    <div className="sn-foto1"></div>
                </div>
            </div>

            {/* BLOQUE 2: foto + texto */}
            <div className="sn-bloque sn-bloque-izquierda">
                <div className="sn-foto-wrapper">
                    <div className="sn-foto2"></div>
                </div>
                <div className="sn-texto">
                    <p>
                        Por aquel entonces nos dedicábamos a la ganadería, combinando una granja
                        avícola con la cría de terneros, un oficio común en la época en la que
                        Mortera era poco más que un pueblo.
                    </p>
                    <p>
                        Fue en 1990 cuando el cariño por los muebles con historia y el gran espacio
                        que nos brindaba nuestra casa de indianos nos abrieron un camino nuevo: el
                        mundo de las antigüedades. Apoyándonos en la tradición familiar en la
                        carpintería, comenzamos a restaurar piezas de manera artesanal, devolviendo
                        la vida a objetos que el tiempo había dejado atrás y respetando siempre su
                        esencia y su historia.
                    </p>
                </div>
            </div>

            {/* BLOQUE 3: texto centrado + foto */}
            <div className="sn-bloque sn-bloque-derecha">
                <div className="sn-texto">
                    <p>
                        A lo largo de los años hemos recorrido el centro de España y Francia en
                        busca de piezas singulares, dos territorios con una riqueza patrimonial
                        extraordinaria. Con Francia nos une además un vínculo familiar muy especial
                        que ha ampliado nuestra mirada hacia estilos y épocas que de otro modo
                        quizás nunca habríamos descubierto.
                    </p>
                    <p>
                        Hoy, más de tres décadas después, Antigüedades Mortera sigue viva y con
                        la misma pasión por la historia de los objetos antiguos, convencidos de
                        que cada pieza guarda una historia única que merece ser preservada y
                        encontrar un nuevo hogar donde continúe su relato.
                    </p>
                </div>
                <div className="sn-foto-wrapper">
                    <div className="sn-foto3"></div>
                </div>
            </div>

        </div>
    )
}
