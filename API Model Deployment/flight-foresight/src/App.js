import './App.css';

import { BrowserRouter } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import BackgroundTravelWebsite from './components/BackgroundTravelWebsite';

function App() {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          {/* Enclose the Navbar and the Hero component in the Router */}
          {/* <NavigationBar /> */}
          <BackgroundTravelWebsite />
          {/* <Hero /> */}
        </div>


      </div>
    </BrowserRouter>
  )
}

export default App;
