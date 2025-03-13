import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../App.css';
import ChatBot from "./ChatBot";

import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';
import dotenv from 'dotenv';

import planeImage from '../images/airplane-7-64.png';
import signInLogo from '../images/—Pngtree—avatar icon profile icon member_5247852.png';
import likedFlights from '../images/610189e478192d00042edc31.png';
import jetsetAI from '../images/askAI.png';
import timeToTravel from '../images/bestTimetoTravel.png';
import exploreImage from '../images/explore.png';
import priceChange from '../images/priceChange.png';
import flightTrackerImage from '../images/flightTrackerImage.png';
import tripImage from '../images/tripsImage.png';
import arrowImage from '../images/arrow.png';
import searchIcon from '../images/magnifying-glass-3-64.png';
import cancunInfo from '../images/cancun.png';
import floridaInfo from '../images/maimi.png';
import losAngelesInfo from '../images/losangeles.png';
import vancouverInfo from '../images/vancouver.png';
import newyorkInfo from '../images/newyork.png';
import nationalpark from '../images/nationalpark.jpg';
import userIcon from '../images/user-profile.jpg';
import { use } from 'react';

const BackgroundTravelWebsite = () => {
    const [isHovered1, setIsHovered1] = React.useState (false);
    const [isHovered2, setIsHovered2] = React.useState (false);
    const [isHovered3, setIsHovered3] = React.useState (false);
    const [isHovered4, setIsHovered4] = React.useState (false);
    const [isHovered5, setIsHovered5] = React.useState (false);
    const [isHovered6, setIsHovered6] = React.useState (false);
    const [isHovered7, setIsHovered7] = React.useState (false);
    const [isHovered8, setIsHovered8] = React.useState (false);
    const [showChat, setShowChat] = useState(false);

    const scrollRef = useRef(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
        }
    };

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null); 

    // Apply body styles on mount
    useEffect(() => {
        document.body.style.backgroundColor = 'rgb(241, 241, 244)'; // White
        // document.body.style.fontFamily = 'Arial, sans-serif';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        // document.body.style.color = '#ccc';

    }, []); // Empty dependency array means it runs only once when the component mounts

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Track the selected currency for the API Call
    const[currency, setCurrency] = useState('CAD');

    const currencyOptions = [
        { value: 'CAD', label: 'Canadian Dollar' },
        { value: 'USD', label: 'US Dollar' },
        { value: 'EUR', label: 'Euro' },
        { value: 'GBP', label: 'British Pound' },
        { value: 'JPY', label: 'Japanese Yen' },
        { value: 'AUD', label: 'Australian Dollar' },
    ];

    const currencySymbols = {
        CAD: 'C$',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        AUD: 'A$',
    };   
    
    // Check for specific airport codes
    const airportCodes = {
        "Los Angeles": "LAX",
        "New York (JFK)": "JFK",
        "San Francisco": "SFO",
        "Chicago (O'Hare)": "ORD",
        "Miami": "MIA",
        "Atlanta": "ATL",
        "Dallas/Fort Worth": "DFW",
        "Denver": "DEN",
        "Seattle": "SEA",
        "Las Vegas": "LAS",
        "Orlando": "MCO",
        "Boston (Logan)": "BOS",
        "Phoenix": "PHX",
        "Houston (Bush Intercontinental)": "IAH",
        "San Diego": "SAN",
        "Minneapolis (MSP)": "MSP",
        "Detroit (DTW)": "DTW",
        "Charlotte": "CLT",
        "Philadelphia": "PHL",
        "Washington D.C. (Dulles)": "IAD",
        "Salt Lake City": "SLC",
        "Baltimore (BWI)": "BWI",
        "Portland (PDX)": "PDX",
        "Kansas City": "MCI",
        "Cleveland (CLE)": "CLE",
        "Indianapolis": "IND",
        "St. Louis": "STL",
        "Tampa": "TPA",
        "Sacramento": "SMF",
        "Raleigh/Durham": "RDU",
        "Newark": "EWR",
        "Pittsburgh": "PIT",
        "Austin": "AUS",
        "Nashville": "BNA",
        "Columbus (CMH)": "CMH",
        "Cincinnati": "CVG",
        "Louisville": "SDF",
        "Oklahoma City": "OKC",
        "Jacksonville": "JAX",
        "Richmond": "RIC",
        "Charlotte": "CLT",
        "Birmingham": "BHM",
        "New Orleans": "MSY",
        "Anchorage": "ANC",
        "Boise": "BOI",
        "Fresno": "FAT",
        "Albany": "ALB",
        "Grand Rapids": "GRR",
        "Lubbock": "LBB",
        "Madison": "MSN",
        "Tucson": "TUS",
        "Charleston (SC)": "CHS",
        "Fort Lauderdale": "FLL",
        "Greensboro": "GBO",
        "Des Moines": "DSM",
        "Chattanooga": "CHA",
        "Buffalo": "BUF",
        "Hartford": "BDL",
        "Louisville": "SDF",
        "Palm Springs": "PSP",
        "Salt Lake City": "SLC",
        "Bakersfield": "BFL",
        "Pensacola": "PNS",
        "Burlington (VT)": "BTV",
        "Montpelier": "MPV",
        "Lynchburg": "LYH"
    };

    const [selectedAirportCode, setSelectedAirportCode] = useState('');
    const [selectedAirportCodeArrival, setSelectedAirportCodeArrival] = useState('');

    const handleInputChange = (e) => {
        const input = e.target.value;
        setDepartureAirport(input);
    
        // Find matching airport code based on the input
        const matchedAirport = Object.keys(airportCodes).find((city) =>
            city.toLowerCase().includes(input.toLowerCase())
        );

        if (matchedAirport) {
            setSelectedAirportCode(airportCodes[matchedAirport]); // Save airport code
        } else {
            setSelectedAirportCode(''); // Reset if no match
        }
    };

    const handleInputChangeArrival = (e) => {
        const input = e.target.value;
        setArrivalAirport(input);
    
        // Find matching airport code based on the input
        const matchedAirport = Object.keys(airportCodes).find((city) =>
          city.toLowerCase().includes(input.toLowerCase())
        );
        if (matchedAirport) {
          setSelectedAirportCodeArrival(airportCodes[matchedAirport]); // Save airport code
        } else {
          setSelectedAirportCodeArrival(''); // Reset if no match
        }
    }

    // Function to swap departure and arrival
    const swapAirports = () => {
        setDepartureAirport(arrivalAirport);
        setArrivalAirport(departureAirport);
        setSelectedDepartureCode(selectedArrivalCode);
        setSelectedArrivalCode(selectedDepartureCode);
    };

    // Create a variable for the cards at the bottom of the page
    const ServiceCard = ({index, title, icon}) => {
        return (
        <Tilt className='xs:w-[250px] w-full'>
            <motion.div
            variants={fadeIn('right', 'spring', 0.5 * index, 0.75)}
            className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
            >
            <div
                options={{
                max: 45,
                scale: 1,
                speed: 450
                }}
                className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex 
                justify-evenly items-center flex-col'
            >
                <img src={icon} alt={title} className='w-16 h-16 object-contain' />
                <h3 className='text-white text-[20px] font-bold text-center'>{title}</h3>
            </div>
    
            </motion.div>
        </Tilt>
        )
    }

    // Check
    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const toggleDropdownCalendar = () => setIsOpenCalendar(!isOpenCalendar);
    

    // Fetch the API search query from the backend for real-time flights
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);     // Set a state for the posts

    // Fetch the search queries prompted from the user
    const [arrivalAirport, setArrivalAirport] = useState('');
    const [departureAirport, setDepartureAirport] = useState('');

    const handleSearch = () => {
        // Grab the search query results from user
        const params = {
            arrival_id: selectedAirportCode,
            departure_id: selectedAirportCodeArrival,
            outbound_date: startDate ? startDate.toISOString().split('T')[0] : undefined,
            return_date: endDate ? endDate.toISOString().split('T')[0] : undefined,
            currency: currency,
        };

        console.log("CORRECTLY grabbing query")
        console.log(params)

        // Debugging
        const queryString = new URLSearchParams(params).toString();
        console.log(`Full Request URL: http://localhost:5001/fetch-flights?${queryString}`);

        const serverUrl = process.env.VITE_SERVER_NODE_URL;

        // axios.get('http://localhost:5001/fetch-flights', { params })
        axios.get(`${serverUrl}/fetch-flights`, { params })
            .then(response => {
                // Get the best flight results from the API call
                setResults(response.data.best_flights);
                setError(null);
            })
            .catch(err => {
                console.error('Error:', err.response ? err.response.data : err.message);
                setError('Failed to fetch search results.');
                setResults(null);
            });
    };

    return (
        <div>
            {/* Header section */}
            <div className="navbar bg-base-100">
            <div className="flex-1">
                    <img 
                        src={planeImage} 
                        alt="JetSet" 
                        style={{
                            width: '40px', 
                            height: 'auto', 
                            transform: 'rotate(1800deg)',  // Rotate the image
                            marginRight: '10px'    // Adds spacing between image and text
                        }} 
                    />
                <h1 style={{ fontSize: '40px', color: 'rgb(0,0,128)' }}>jetSet</h1>
            </div>
            <div className="flex-none">
                {/* Add a drop-down menu for currency selection */}
                <div className="dropdown dropdown-hover">
                        <div tabIndex={0} role="button" className="btn m-1">Currency</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li>
                                <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                >
                                    {currencyOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </li>
                        </ul>
                </div>

                <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="badge badge-sm indicator-item">8</span>
                    </div>
                </div>
                <div
                    tabIndex={0}
                    className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
                    <div className="card-body">
                    <span className="text-lg font-bold">8 Items</span>
                    <span className="text-info">Subtotal: $999</span>
                    <div className="card-actions">
                        <button className="btn btn-primary btn-block">View cart</button>
                    </div>
                    </div>
                </div>
                </div>
                <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-30 rounded-full">
                    <img
                        alt="Tailwind CSS Navbar component"
                        // src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        src={userIcon} />
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
                    <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                    </a>
                    </li>
                    <li><a>Settings</a></li>
                    <li><a>Logout</a></li>
                </ul>
                </div>
            </div>
            </div>
            
            {/* New Hero Section with Flight Search Capabilities */}
            <div
                className="hero min-h-screen"
                style={{
                    position: 'relative',
                    backgroundImage: `url(${nationalpark})`,
                    // backgroundSize: 'contain', // Ensures the image is resized to fit within the container
                    backgroundPosition: 'center', // Centers the image
                    backgroundRepeat: 'no-repeat', // Prevents the image from repeating
                }}>

                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for dimming
                        zIndex: 0, // Ensures the overlay is above the background
                    }}
                ></div>

                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-white text-left pl-8">
                    <div className="max-w-full">
                    <h1 className="mb-5 text-7xl font-bold">Explore the world with jetSet.</h1>
                    <p className="mb-5">
                        Search for flights and predict their real-time flight times.
                    </p>
                    </div>
                </div>

                {/* Flight Search box */}
                <div
                    // className="bg-white rounded-2xl shadow-lg p-6 max-w-6xl mx-auto my-8"
                    className="absolute bottom-0 bg-white rounded-2xl shadow-lg p-6 w-[80%] max-w-8xl mx-auto my-8"
                    style={{
                        zIndex: 10, // Ensures the search box is above other elements
                        marginBottom: '-50px', // Creates overlap between the image and the search box
                    }}
                >
                    {/* Flight Path Options */}
                    <div className='flight-path'>
                        <ul className="hover:bg-transparent menu menu-horizontal bg-base-200">
                            <li className='hover:border-b-2 hover:border-blue-400 hover:bg-transparent'>
                                <a className="hover:text-blue-400">Roundtrip</a>
                            </li>
                            <li className='hover:border-b-2 hover:border-blue-400 hover:bg-transparent'>
                                <a className="hover:text-blue-400">One-way</a>
                            </li>
                        </ul>
                    </div>

                    {/* Search departure flight input fields */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Leaving from?</span>
                        </div>
                        <input 
                            list="airport-list"
                            type="text" 
                            placeholder="Leaving from" 
                            value={departureAirport} 
                            onChange={handleInputChange}
                            className="input input-bordered w-full max-w-xs border-2 border-solid border-blue-800" 
                        />
                        {/* Datalist for autofill */}
                        <datalist id="airport-list">
                            {Object.keys(airportCodes).map((airport, index) => (
                            <option key={index} value={airport}>
                                {airportCodes[airport]} - {airport}
                            </option>
                            ))}
                        </datalist>

                        {/* Show the selected airport code */}
                        {/* {selectedAirportCode && (
                            <div className="mt-2">
                            <p>Selected Airport Code: {selectedAirportCode}</p>
                            </div>
                        )} */}
                    </label>

                    {/* Swap Arrow Icon */}
                    <button 
                    className="btn btn-circle btn-outline"
                    onClick={swapAirports}
                    title="Swap airports"
                    >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 4l5 5-5 5M7 20l-5-5 5-5"
                        />
                    </svg>
                    </button>

                    {/* Arrival Airport Input Parameters */}
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Going to?</span>
                        </div>
                        <input 
                            list="airport-list"
                            type="text" 
                            placeholder="Going to" 
                            value={arrivalAirport} 
                            onChange={handleInputChangeArrival}
                            className="input input-bordered w-full max-w-xs border-2 border-solid border-blue-800" 
                        />
                    </label>

                    {/* Add the Flight Dates Picker */}
                    <div style={{ display: "flex", flexDirection: "column", gap: '2px' }}>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Departure Date</span>
                            </div>
                            <DatePicker 
                                selected={startDate} 
                                onChange={(date) => setStartDate(date)}
                                placeholderText="start date"
                                dateFormat="MM/dd/yyyy"
                                minDate={new Date()} 
                                className="custom-datepicker input input-bordered w-full max-w-x border-2 border-solid border-blue-800"
                                style={{
                                    padding: "10px",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                }}
                            />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Arrival Date</span>
                            </div>
                            <DatePicker 
                                selected={endDate} 
                                onChange={(date) => setEndDate(date)}
                                placeholderText="end date"
                                dateFormat="MM/dd/yyyy"
                                minDate={new Date()} // Prevent past dates
                                className="custom-datepicker input input-bordered w-full max-w-xs border-2 border-solid border-blue-800"
                                style={{
                                    padding: "10px",
                                    border: '3px solid #000080',
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                }}
                            />
                        </label>
                    </div>
                    
                    {/* Add a search icon */}
                    <button onClick={handleSearch} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <img 
                            src={searchIcon} 
                            alt="Clickable Button" 
                            // style={{ width: '50px', height: '50px' }}
                        />
                    </button>


                    </div>
                </div>

            </div>

            {/* Display the returned flights in an accordian style result */}
            <div className="mt-20 w-[80%] mx-auto"> {/* This pushes the entire section down */}
                {/* <h1 className="mb-5 text-5xl font-bold">Best Flight Results</h1> */}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div>
                    {/* {results && results.length > 0 ? ( */}
                    {results && results.length > 0 && (
                        <h1 className="mb-5 text-5xl font-bold">Best Flight Results</h1>
                    )}

                    {results ? (
                    results.map((flight, index) => (
                        <div key={index} className="collapse collapse-arrow bg-base-200 rounded-lg shadow-lg mb-4">
                            <input type="radio" name="my-accordion-2" defaultChecked />
                            <div className="collapse-title text-xl font-medium flex items-center space-x-4 py-4">
                                <img src={flight.airline_logo} alt={flight.flights[0].airline} width="50" />
                                <div className="flex-grow">
                                    <h2 className="font-semibold">{flight.flights[0].airline} - {flight.flights[0].flight_number}</h2>
                                    <p className="text-sm text-gray-500">{flight.flights[0].departure_airport.time}</p>
                                </div>
                                <span className="font-semibold text-gray-800">{currencySymbols[currency] || ''}{flight.price}</span>
                            </div>

                            <div className="collapse-content p-4 space-y-4 bg-white rounded-lg shadow-lg">
                                {/* Departure Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21l-2-2m0 0l-2-2m2 2l2-2m-2 2V3a2 2 0 00-2-2H7a2 2 0 00-2 2v14l-2 2h16z" />
                                        </svg>
                                        <p className="text-lg font-semibold">Departure</p>
                                    </div>
                                    <p>{flight.flights[0].departure_airport.name} at {flight.flights[0].departure_airport.time}</p>
                                </div>

                                {/* Arrival Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-2 2m0 0l-2 2m2-2h-7l-4 4V5l4 4h7z" />
                                        </svg>
                                        <p className="text-lg font-semibold">Arrival</p>
                                    </div>
                                    <p>{flight.flights[0].arrival_airport.name} at {flight.flights[0].arrival_airport.time}</p>
                                </div>

                                {/* Duration Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3H6v4H2v2h4v4h2V9h4V7h-4z" />
                                        </svg>
                                        <p className="text-lg font-semibold">Duration</p>
                                    </div>
                                    <p>{flight.total_duration} minutes</p>
                                </div>

                                {/* Carbon Emissions Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4v16h18V4H3zm2 2h14v12H5V6zm5 8h4v2h-4z" />
                                        </svg>
                                        <p className="text-lg font-semibold">Carbon Emissions</p>
                                    </div>
                                    <p>{flight.carbon_emissions.this_flight} g</p>
                                </div>

                                {/* Travel Class Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3H6v4H2v2h4v4h2V9h4V7h-4z" />
                                        </svg>
                                        <p className="text-lg font-semibold">Travel Class</p>
                                    </div>
                                    <p>{flight.flights[0].travel_class}</p> {/* Travel Class info */}
                                </div>

                                {/* Flight Type - Round trip or One way */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17l-5 5m0 0l-5-5m5 5V3m0 14l5-5m-5 5l-5-5" />
                                    </svg>
                                        <p className="text-lg font-semibold">Type</p>
                                    </div>
                                    <p>{flight.type}</p> {/* Travel Class info */}
                                </div>
                            </div>

                        </div>

                        

                    ))
                    ) : (
                    // <p>No flights available.</p>
                        <p></p>
                    )}
                </div>
                
            </div>

            {/* Create a div for the Popups cards */}
            <div className='mt-40 flex flex-wrap gap-6 justify-center'>
                {/* Ask Jetset AI Popup */}
                <Tilt className='w-[200px] sm:w-[220px]'>
                    <motion.div
                        className='w-full bg-white p-[1px] rounded-[20px] shadow-card border-2 border-blue-800'
                    >
                        <div
                            options={{
                                max: 25,
                                scale: 1,
                                speed: 200
                            }}
                            className='bg-white rounded-[20px] py-12 px-6 min-h-[220px] flex justify-evenly items-center flex-col'
                        >
                            <img src={jetsetAI} alt="AI for jetSet" className='w-25 h-25 object-contain' />
                            <h3 className='text-black text-[20px] font-bold text-center'>ask jetSet AI</h3>
                        </div>
                    </motion.div>
                </Tilt>

                {/* Best time to travel Popup */}
                <Tilt className='w-[200px] sm:w-[220px]'>
                    <motion.div
                        className='w-full bg-white p-[1px] rounded-[20px] shadow-card border-2 border-blue-800'
                    >
                        <div
                            options={{
                                max: 25,
                                scale: 1,
                                speed: 200
                            }}
                            className='bg-white rounded-[20px] py-8 px-6 min-h-[220px] flex justify-evenly items-center flex-col'
                        >
                            <img src={timeToTravel} alt="Best time to Travel" className='w-25 h-25 object-contain' />
                            <h3 className='text-black text-[20px] font-bold text-center'>what's the best time to travel?</h3>
                        </div>
                    </motion.div>
                </Tilt>

                {/* Explore Popup */}
                <Tilt className='w-[200px] sm:w-[220px]'>
                    <motion.div
                        className='w-full bg-white p-[1px] rounded-[20px] shadow-card border-2 border-blue-800'
                    >
                        <div
                            options={{
                                max: 25,
                                scale: 1,
                                speed: 200
                            }}
                            className='bg-white rounded-[20px] py-12 px-6 min-h-[220px] flex justify-evenly items-center flex-col'
                        >
                            <img src={exploreImage} alt="Explore" className='w-25 h-25 object-contain' />
                            <h3 className='text-black text-[20px] font-bold text-center'>explore</h3>
                        </div>
                    </motion.div>
                </Tilt>

                {/* Price Change Popup */}
                <Tilt className='w-[200px] sm:w-[220px]'>
                    <motion.div
                        className='w-full bg-white p-[1px] rounded-[20px] shadow-card border-2 border-blue-800'
                    >
                        <div
                            options={{
                                max: 25,
                                scale: 1,
                                speed: 200
                            }}
                            className='bg-white rounded-[20px] py-5 px-6 min-h-[220px] flex justify-evenly items-center flex-col'
                        >
                            <img src={priceChange} alt="Price Change" className='w-25 h-25 object-contain' />
                            <h3 className='text-black text-[20px] font-bold text-center'>price change detection</h3>
                        </div>
                    </motion.div>
                </Tilt>

                {/* Trips Popup */}
                <Tilt className='w-[200px] sm:w-[220px]'>
                    <motion.div
                        className='w-full bg-white p-[1px] rounded-[20px] shadow-card border-2 border-blue-800'
                    >
                        <div
                            options={{
                                max: 25,
                                scale: 1,
                                speed: 200
                            }}
                            className='bg-white rounded-[20px] py-16 px-6 min-h-[220px] flex justify-evenly items-center flex-col'
                        >
                            <img src={tripImage} alt="Liked Flights" className='w-25 h-25 object-contain' />
                            <h3 className='text-black text-[20px] font-bold text-center'>trips</h3>
                        </div>
                    </motion.div>
                </Tilt>

                {/* Flight Tracker Popup */}
                <Tilt className='w-[200px] sm:w-[220px]'>
                    <motion.div
                        className='w-full bg-white p-[1px] rounded-[20px] shadow-card border-2 border-blue-800'
                    >
                        <div
                            options={{
                                max: 25,
                                scale: 1,
                                speed: 200
                            }}
                            className='bg-white rounded-[20px] py-14 px-6 min-h-[220px] flex justify-evenly items-center flex-col'
                        >
                            <img src={flightTrackerImage} alt="Liked Flights" className='w-25 h-25 object-contain' />
                            <h3 className='text-black text-[20px] font-bold text-center'>flight tracker</h3>
                        </div>
                    </motion.div>
                </Tilt>
            </div>


            <div className="background-container">
                {/* Toggle Button */}
                {/* <button className="chat-toggle-btn" onClick={() => setShowChat(!showChat)}> */}
                <button className="chat-toggle-btn btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-blue-800 text-white hover:bg-blue-1000 z-[1000]" onClick={() => setShowChat(!showChat)}>
                    {showChat ? "Close Chat" : "Ask FlightForesight AI"}
                </button>

                {/* Chatbot on the Right Side */}
                {showChat && (
                    <div className="chatbot-wrapper">
                        <ChatBot />
                    </div>
                )}
            </div>

            {/* Footer Section */}
            <footer className="footer bg-neutral text-neutral-content p-10">
            <aside>
                <img 
                    src={planeImage} 
                    alt="JetSet" 
                    style={{
                        width: '40px', 
                        height: 'auto', 
                        transform: 'rotate(1800deg)',  // Rotate the image
                        marginRight: '10px'    // Adds spacing between image and text
                    }} 
                />
                <p>
                FlightForesight
                <br />
                </p>
            </aside>
            <nav>
                <h6 className="footer-title pl-6">Social</h6>
                <div className="grid grid-flow-col gap-4">
                <a>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current">
                    <path
                        d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                </a>
                <a>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current">
                    <path
                        d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                    </svg>
                </a>
                <a>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current">
                    <path
                        d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                    </svg>
                </a>
                </div>
            </nav>
            </footer>
        </div>
    );
};

export default BackgroundTravelWebsite;
