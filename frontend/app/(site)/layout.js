import { getSettings, getMenu } from "@/lib/api";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function SiteLayout({ children }) {
  const [settings, mainMenu, footerMenu] = await Promise.all([
    getSettings(),
    getMenu("main"),
    getMenu("footer"),
  ]);

  return (
    <CartProvider>
      <Navbar settings={settings} menu={mainMenu} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} footerMenu={footerMenu} />
    </CartProvider>
  );
}
