import { NavLink } from 'react-router-dom'
// import { ReactComponent as Brand } from '../assets/flightlogo.svg'
import Brand from '../assets/flightlogo.svg'
import '../styles/navbar.css'

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <img src={Brand} alt="Brand Logo" />
        </div>
        <div className="nav-elements">
          <ul>
            <li className="flight-foresight-title">
              <NavLink to="/">Flight Foresight</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/trips">Trips</NavLink>
            </li>
            <li>
              <NavLink to="/create">Create Account</NavLink>
            </li>
            <li>
              <NavLink to="/signin">Sign In</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar