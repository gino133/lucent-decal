// frontend/src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getMenu } from '../../services/api';

const Navbar = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Fallback menu mặc định nếu API chưa có dữ liệu
  const defaultMenu = [
    { label: 'Trang chủ', link: '/' },
    { label: 'Giới thiệu', link: '/gioi-thieu' },
    { label: 'Sản phẩm', link: '/san-pham' },
    { label: 'Dự án', link: '/du-an' },
    { label: 'Hồ sơ', link: '/ho-so' },
    { label: 'Liên hệ', link: '/lien-he' },
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getMenu('main-menu');
        if (res.data && res.data.items && res.data.items.length > 0) {
          setMenuItems(res.data.items);
        } else {
          setMenuItems(defaultMenu);
        }
      } catch (err) {
        console.error('Failed to load menu, using default', err);
        setMenuItems(defaultMenu);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng menu mobile khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-surface/90 backdrop-blur-md shadow-md' : 'bg-surface/80 backdrop-blur-md'
    } border-b border-on-surface/10`}>
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-20">
        {/* Logo */}
        <Link to="/" className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
          Lucent Glass
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 h-full">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className={`font-label-bold text-label-bold ${
                location.pathname === item.link
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-on-surface-variant hover:text-secondary'
              } pb-1 transition-colors duration-300`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link to="/gio-hang" className="flex items-center hover:text-secondary transition-colors relative">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute -top-1 -right-2 bg-secondary text-on-secondary text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
            <span className="font-label-bold text-label-bold hidden sm:inline ml-1">Giỏ hàng</span>
          </Link>
          <button className="bg-secondary-fixed text-on-secondary-fixed font-label-bold text-label-bold px-4 md:px-6 py-2.5 rounded-lg active:scale-95 transition-all shadow-sm hover:shadow-md whitespace-nowrap">
            Nhận báo giá
          </button>
          {/* Mobile hamburger */}
          <button
            className="md:hidden text-on-surface p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-on-surface/10 shadow-lg">
          <div className="flex flex-col px-margin-mobile py-4 space-y-3">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className={`font-label-bold text-label-bold py-2 ${
                  location.pathname === item.link
                    ? 'text-secondary border-l-4 border-secondary pl-3'
                    : 'text-on-surface-variant hover:text-secondary pl-3'
                } transition-colors duration-200`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-on-surface/10">
              <Link to="/gio-hang" className="flex items-center gap-2 font-label-bold text-label-bold text-on-surface-variant hover:text-secondary py-2 pl-3">
                <span className="material-symbols-outlined">shopping_cart</span>
                Giỏ hàng (0)
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;