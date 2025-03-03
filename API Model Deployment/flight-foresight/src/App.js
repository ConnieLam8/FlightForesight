<<<<<<< HEAD
import './App.css';

import { BrowserRouter } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
// import ChatbotComp from './components/ChatbotComp';

import FlightSearch from './components/FlightSearch';

import FlightSearch from './components/FlightSearch';
import BackgroundTravelWebsite from './components/BackgroundTravelWebsite';

function App() {
  return (
    // <ThemeProvider>
    <div className='App'>
      <BrowserRouter>
            {/* Enclose the Navbar and the Hero component in the Router */}
            <NavigationBar />
            {/* <ChatbotComp /> */}
            <FlightSearch />
      </BrowserRouter>
    </div>
    // </ThemeProvider>
    
  )
=======
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
>>>>>>> main
}

export default App;
