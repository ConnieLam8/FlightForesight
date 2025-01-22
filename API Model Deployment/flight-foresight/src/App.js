import './App.css';

import { BrowserRouter } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          {/* Enclose the Navbar and the Hero component in the Router */}
          <NavigationBar />
          {/* <Hero /> */}
        </div>


      </div>
    </BrowserRouter>
  )
}

export default App;
