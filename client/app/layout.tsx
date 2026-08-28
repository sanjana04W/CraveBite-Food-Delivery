"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConsultationProvider } from "@/components/ConsultationContext";
import { AuthProvider } from "@/components/AuthContext";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import OrderTrackModal from "@/components/OrderTrackModal";
import ScrollToTop from "@/components/ScrollToTop";

function GlobalModals() {
  return (
    <>
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackModal />
      <ScrollToTop />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbarFooter = ["/login", "/forgot-password", "/signup"].includes(pathname) || pathname.startsWith("/admin");

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <title>CraveBite - Fresh, Fast & Delicious Food Delivery</title>
        <meta name="description" content="Order artisan pizzas, smash burgers, Asian noodle bowls, biryanis, healthy salads, and decadent desserts delivered hot in under 30 minutes." />
      </head>
      <body className="min-h-full flex flex-col bg-[#F7F2EB] text-stone-900 font-sans selection:bg-orange-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <ConsultationProvider>
              {!hideNavbarFooter && <Navbar />}
              <main className="flex-1">{children}</main>
              {!hideNavbarFooter && <Footer />}
              <GlobalModals />
            </ConsultationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}