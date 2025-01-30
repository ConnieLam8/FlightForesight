import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FlightChatbot from "./ChatBot";

function App() {
    return (
        <BrowserRouter>
            <div className="relative z-0 bg-primary">
                <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
                    <Routes>
                        <Route path="/" element={<FlightChatbot />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
