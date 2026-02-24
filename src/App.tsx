import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartDrawer from "./components/CartDrawer";
import FloatingCart from "./components/FloatingCart";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./context/CartContext";
import { DataProvider, useData } from "./context/DataContext";
import LoadingScreen from "./components/LoadingScreen";
import NotFoundPage from "./pages/NotFoundPage";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

function AppContent() {
  const { loading, business } = useData();

  useEffect(() => {
    if (!loading) {
      const existingLinks = document.querySelectorAll(
        "link[rel~='icon'], link[rel='apple-touch-icon']",
      );

      if (business?.favicon) {
        if (existingLinks.length > 0) {
          existingLinks.forEach((link) => {
            (link as HTMLLinkElement).href = business.favicon!;
            // Remove specific attributes so the browser doesn't reject it for mismatch
            link.removeAttribute("sizes");
            link.removeAttribute("type");
          });
        } else {
          const newLink = document.createElement("link");
          newLink.rel = "icon";
          newLink.href = business.favicon;
          document.head.appendChild(newLink);
        }
      } else {
        // Remove favicons if none is provided
        existingLinks.forEach((link) => link.remove());
      }
    }
  }, [loading, business?.favicon]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loading" />
      ) : (
        <div
          key="content"
          className="min-h-screen bg-brand-50 text-gray-800 font-sans flex flex-col"
        >
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cardapio" element={<MenuPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer />
          <FloatingCart />
        </div>
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <APIProvider
      apiKey={GOOGLE_API_KEY}
      libraries={["places"]}
      language="pt-BR"
    >
      <DataProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </DataProvider>
      <Analytics />
      <SpeedInsights />
    </APIProvider>
  );
}

export default App;
