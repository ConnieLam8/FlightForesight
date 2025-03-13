import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
// import '../styles/styles.css';

import { ThemeContext } from './ThemeContext';

import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    Card,
    IconButton,
} from "@material-tailwind/react";

import {
    CubeTransparentIcon,
    UserCircleIcon,
    CodeBracketSquareIcon,
    Square3Stack3DIcon,
    ChevronDownIcon,
    // Cog6ToothIcon,
    // InboxArrowDownIcon,
    // LifebuoyIcon,
    PowerIcon,
    RocketLaunchIcon,
    Bars2Icon,
} from "@heroicons/react/24/solid";

// Profile menu component
const profileMenuItems = [
    {
        label: "My Profile",
        icon: UserCircleIcon,
    },
    {
        label: "Sign Out",
        icon: PowerIcon,
    },
];

function ProfileMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <Menu open = {isMenuOpen} handler = {setIsMenuOpen} placement = "bottom-end">
            <MenuHandler>
                <Button
                    variant='text'
                    color='blue-gray'
                    className='flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto'
                >
                    <Avatar 
                        variant='circular'
                        size='sm'
                        alt='default profile'
                        className='border border-gray-900 p-0.5'
                        src='flight-foresight\src\assets\Default_pfp.png'
                    />
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`h-3 w-3 transition-transform ${
                            isMenuOpen ? 'rotate-180' : ''
                        }`}
                    />
                </Button>
            </MenuHandler>
            {/* Cycle through the available profile options */}
            <MenuList className='p-1'>
                {profileMenuItems.map(({label, icon}, key) => {
                    const isLast = key === profileMenuItems.length - 1;

                    return (
                        <MenuItem
                            key={label}
                            onClick={closeMenu}
                            className={`flex items-center gap-2 rounded ${
                                isLast
                                    ? 'hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10'
                                    : ''
                            }`}
                        >
                            {React.createElement(icon, {
                                className: `h-4 w-4 ${isLast ? 'text-red-500' : ''}`,
                                strokeWidth: 2,
                            })}
                            <Typography
                                as='span'
                                variant='small'
                                className='font-normal'
                                color={isLast ? 'red' : 'inherit'}
                            >
                                {label}
                            </Typography>
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    )
}

// Create a function for the rest of the navigation items
const navListItems = [
    {
        label: "Account",
        icon: UserCircleIcon,
    },
    {
        label: "About",
        icon: CubeTransparentIcon,
    },
    {
        label: "Trips",
        icon: CodeBracketSquareIcon,
    },
];

function NavList() {
    return (
        <ul className='mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center'>
            {navListItems.map(({label, icon}, key) => (
                <Typography
                    key={label}
                    as='a'
                    href='#'
                    variant='small'
                    color='gray'
                    className='font-medium text-blue-gray-500'
                >
                    <MenuItem className='flex items-center gap-2 lg:rounded-full'>
                        {React.createElement(icon, {className: 'h-[18px] w-[18px]'})}{' '}
                        <span className='text-gray-900'> {label}</span>
                    </MenuItem>
                </Typography>
            ))}
        </ul>
    )
}

const NavigationBar = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
 
    const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
 
    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setIsNavOpen(false),
        );
    }, []);

    return (
        <Navbar className='mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6'>
            <div className='relative mx-auto flex items-center justify-between text-blue-gray-900'>
                <Typography
                    as='a'
                    href='#'
                    className='mr-4 ml-2 cursor-pointer py-1.5 font-medium'
                >
                    FlightForesight
                </Typography>
                <div className='flex ml-right items-center'>
                <div className='hidden lg:block'>
                    <NavList />
                </div>
                <IconButton
                size="sm"
                color="blue-gray"
                variant="text"
                onClick={toggleIsNavOpen}
                className="ml-auto mr-2 lg:hidden"
                >
                    <Bars2Icon className="h-6 w-6" />
                </IconButton>
        
                <Button size="sm" variant="text">
                    <span>Log In</span>
                </Button>
                <ProfileMenu />
            </div>
            </div>
            <MobileNav open={isNavOpen} className="overflow-scroll">
                <NavList />
            </MobileNav>
        </Navbar>
    );
}

// Code I Connie edited myself
// const NavigationBar = () => {
//     // Set a newState field for the link onClick
//     const [active, setActive] = useState('');
//     // Set a useState for toggle
//     const [toggle, setToggle] = useState(false);

//     return (
//         <nav className={
//             `w-full flex items-center py-5 fixed top-0 z-20 bg-primary`
//         }>

//         {/* Create a div for the logo */}
//         <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
//             <Link 
//                 to='/' 
//                 className='flex items-center gap-2' 
//                 onClick={() => {
//                     setActive("");
//                     window.scrollTo(0, 0);  // Scrolls to the top of the page
//             }}>

//                 {/* Render an image for the logo */}
//                 {/* <img src={logo} alt='logo' className='w-9 h-9 object-contain' /> */}
//                 <p className='text-white text-[18px] font-bold cursor-pointer flex'>FlightForesight</p>
//             </Link>

            

//             {/* <ul className='list-none hidden sm:flex flex-row gap-10'>
//                 <li
//                     className={`${
//                         active === Link.title
//                         ? 'text-white'
//                         : 'text-secondary'
//                     } hover:text-white text-[18px] font-mdeium cursor-pointer`}
//                     onClick={() => setActive(Link.title)}
//                 >
                    
//                 </li>
//             </ul> */}

//         </div>

//         {/* Create a list for the actual navigation links */}
//         <div className='navbarRight'>
//             <li>
//                 <a href='/about' className=''>About</a>
//             </li>
//             <li>
//                 <a href='/trips' className=''>Trips</a>
//             </li>
//             <li>
//                 <a href='/createAccount' className=''>Create Account</a>
//             </li>
//         </div>

//         </nav>
//     )
// }

export default NavigationBar