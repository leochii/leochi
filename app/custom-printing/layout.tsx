import Navbar from "../components/navbar";
import SiteFooter from "../components/site-footer";
import { CartProvider } from "../context/cartcontext";

export default function CustomPrintingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <SiteFooter />
    </CartProvider>
  );
}