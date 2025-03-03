<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import styles from "../styles.module.css";

const NavigationBar = () => {
    // Set a newState field for the link onClick
    const [active, setActive] = useState('');
    // Set a useState for toggle
    const [toggle, setToggle] = useState(false);

    return (
        <nav className={
            `w-full flex items-center py-5 fixed top-0 z-20 bg-primary`
        }>

        {/* Create a div for the logo */}
        <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
            <Link 
                to='/' 
                className='flex items-center gap-2' 
                onClick={() => {
                    setActive("");
                    window.scrollTo(0, 0);  // Scrolls to the top of the page
            }}>

                {/* Render an image for the logo */}
                {/* <img src={logo} alt='logo' className='w-9 h-9 object-contain' /> */}
                <p className='text-white text-[18px] font-bold cursor-pointer flex'>Connie Lam</p>
            </Link>

            {/* Create a list for the actual navigation links */}
            <ul className='list-none hidden sm:flex flex-row gap-10'>
                <li
                    className={`${
                        active === Link.title
                        ? 'text-white'
                        : 'text-secondary'
                    } hover:text-white text-[18px] font-mdeium cursor-pointer`}
                    onClick={() => setActive(Link.title)}
                >
                    
                </li>

            </ul>

        </div>

        </nav>
    )
>>>>>>> main
}

export default NavigationBar