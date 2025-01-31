import './App.css';

import { BrowserRouter } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';

import FlightSearch from './components/FlightSearch';
import BackgroundTravelWebsite from './components/BackgroundTravelWebsite';

function App() {
  return (
    // <ThemeProvider>
    <div className='App'>
      <BrowserRouter>
            {/* Enclose the Navbar and the Hero component in the Router */}
            <NavigationBar />
            <BackgroundTravelWebsite />
            <FlightSearch />
      </BrowserRouter>
    </div>
    // </ThemeProvider>
  )
}

export default App;
