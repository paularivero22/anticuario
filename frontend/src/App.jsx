import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Perfil from './pages/Perfil'
import Catalogo from './pages/Catalogo'
import SobreNosotros from './pages/SobreNosotros'
import Contacto from './pages/Contacto'
import Admin from './pages/Admin'
import AdminProductoForm from './pages/AdminProductoForm'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/productos/:categoriaId" element={<Layout><Productos /></Layout>} />
          <Route path="/producto/:id" element={<Layout><ProductoDetalle /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/registro" element={<Layout><Registro /></Layout>} />
          <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
          <Route path="/catalogo" element={<Layout><Catalogo /></Layout>} />
          <Route path="/sobre-nosotros" element={<Layout><SobreNosotros /></Layout>} />
          <Route path="/contacto" element={<Layout><Contacto /></Layout>} />
          <Route path="/admin" element={<Layout><Admin /></Layout>} />
          <Route path="/admin/producto/nuevo" element={<AdminProductoForm />} />
          <Route path="/admin/producto/:id" element={<AdminProductoForm />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App