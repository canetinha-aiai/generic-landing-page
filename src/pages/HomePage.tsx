import React from 'react';
import Hero from '../components/Hero';
import DeliveryBanner from '../components/DeliveryBanner';
import MenuSection from '../components/MenuSection';
import ReviewsSection from '../components/ReviewsSection';
import LocationSection from '../components/LocationSection';

const HomePage = () => {
    return (
        <>
            <Hero />
            <DeliveryBanner />
            <MenuSection />
            <ReviewsSection />
            <LocationSection />
        </>
    );
};

export default HomePage;
