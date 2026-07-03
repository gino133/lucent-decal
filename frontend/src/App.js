import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
// Admin routes
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import PageEditor from './admin/PageEditor';
import MenuManager from './admin/MenuManager';
import Settings from './admin/Settings';
import Login from './admin/Login';
import ProductManager from './admin/ProductManager';
import ProjectManager from './admin/ProjectManager';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gioi-thieu" element={<About />} />
        <Route path="/san-pham" element={<Products />} />
        <Route path="/san-pham/:slug" element={<ProductDetail />} />
        <Route path="/du-an" element={<Projects />} />
        <Route path="/du-an/:slug" element={<ProjectDetail />} />
        <Route path="/ho-so" element={<Profile />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/gio-hang" element={<Cart />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pages/:slug?" element={<PageEditor />} />
          <Route path="menu" element={<MenuManager />} />
          <Route path="settings" element={<Settings />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="projects" element={<ProjectManager />} />
        </Route>
        <Route path="/admin/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;