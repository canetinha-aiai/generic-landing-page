"use client";

import { StoreData } from "@/src/types/store";
import { DataProvider } from "@/src/context/DataContext";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import CartDrawer from "@/src/components/CartDrawer";
import FloatingCart from "@/src/components/FloatingCart";
import Hero from "@/src/components/Hero";
import DeliveryBanner from "@/src/components/DeliveryBanner";
import MenuSection from "@/src/components/MenuSection";
import ReviewsSection from "@/src/components/ReviewsSection";
import LocationSection from "@/src/components/LocationSection";
import { IFoodProvider } from "@/src/context/IFoodContext";

export default function HomePageClient({
  initialData,
  isIFoodEnabled,
}: {
  initialData: StoreData | null;
  isIFoodEnabled: boolean;
}) {
  return (
    <IFoodProvider isEnabled={isIFoodEnabled}>
      <DataProvider initialData={initialData}>
        <div className="min-h-screen bg-brand-50 text-gray-800 font-sans flex flex-col">
          <Header />
          <main className="flex-grow">
            <Hero />
            <DeliveryBanner />
            <MenuSection />
            <ReviewsSection />
            <LocationSection />
          </main>
          <Footer />
          <CartDrawer />
          <FloatingCart />
        </div>
      </DataProvider>
    </IFoodProvider>
  );
}
