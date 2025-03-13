import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BackgroundWebsite from './components/BackgroundTravelWebsite.jsx';

// Testing Carousel Component
import Carousel from './components/ui/apple-cards-carousel.jsx';
import './components/ui/Carousel.css';

function App() {
    return (
        <BrowserRouter>
            <div className="relative z-0 bg-primary">
                <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
                    <Routes>
                        <Route 
                            path="/" 
                            element={
                                <>
                                    <BackgroundWebsite />
                                    <Carousel />
                                </>
                            } 
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
