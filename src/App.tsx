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

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

function AppContent() {
  const { loading } = useData();

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
    </APIProvider>
  );
}

export default App;
