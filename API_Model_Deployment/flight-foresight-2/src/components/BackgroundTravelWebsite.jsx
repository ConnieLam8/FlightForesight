import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../App.css';
import ChatBot from "./ChatBot";
import Select from 'react-select';

// import { Tilt } from 'react-tilt';
import ParallaxTilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

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
        "Allentown/Bethlehem/Easton, PA": "ABE",
        "Abilene, TX": "ABI",
        "Albuquerque, NM": "ABQ",
        "Aberdeen, SD": "ABR",
        "Albany, GA": "ABY",
        "Nantucket, MA": "ACK",
        "Waco, TX": "ACT",
        "Arcata/Eureka, CA": "ACV",
        "Atlantic City, NJ": "ACY",
        "Alexandria, LA": "AEX",
        "Augusta, GA": "AGS",
        "Albany, NY": "ALB",
        "Waterloo, IA": "ALO",
        "Alamosa, CO": "ALS",
        "Walla Walla, WA": "ALW",
        "Amarillo, TX": "AMA",
        "Alpena, MI": "APN",
        "Watertown, NY": "ART",
        "Aspen, CO": "ASE",
        "Atlanta, GA": "ATL",
        "Watertown, SD": "ATY",
        "Austin, TX": "AUS",
        "Asheville, NC": "AVL",
        "Wilkes-Barre/Scranton, PA": "AVP",
        "Kalamazoo, MI": "AZO",
        "Hartford, CT": "BDL",
        "Scottsbluff, NE": "BFF",
        "Bakersfield, CA": "BFL",
        "Mobile, AL": "BFM",
        "Binghamton, NY": "BGM",
        "Bangor, ME": "BGR",
        "Birmingham, AL": "BHM",
        "Bishop, CA": "BIH",
        "Billings, MT": "BIL",
        "Bismarck/Mandan, ND": "BIS",
        "Bellingham, WA": "BLI",
        "Belleville, IL": "BLV",
        "Bloomington/Normal, IL": "BMI",
        "Nashville, TN": "BNA",
        "Boise, ID": "BOI",
        "Boston, MA": "BOS",
        "Beaumont/Port Arthur, TX": "BPT",
        "Brainerd, MN": "BRD",
        "Brownsville, TX": "BRO",
        "Butte, MT": "BTM",
        "Baton Rouge, LA": "BTR",
        "Burlington, VT": "BTV",
        "Buffalo, NY": "BUF",
        "Burbank, CA": "BUR",
        "Baltimore, MD": "BWI",
        "Bozeman, MT": "BZN",
        "Columbia, SC": "CAE",
        "Akron/Canton, OH": "CAK",
        "Cedar City, UT": "CDC",
        "Cape Girardeau, MO": "CGI",
        "Chattanooga, TN": "CHA",
        "Charlottesville, VA": "CHO",
        "Charleston, SC": "CHS",
        "Cedar Rapids/Iowa City, IA": "CID",
        "Sault Ste. Marie, MI": "CIU",
        "Clarksburg, WV": "CKB",
        "Cleveland, OH": "CLE",
        "College Station, TX": "CLL",
        "Charlotte, NC": "CLT",
        "Columbus, OH": "CMH",
        "Champaign/Urbana, IL": "CMI",
        "Hancock/Houghton, MI": "CMX",
        "Moab, UT": "CNY",
        "Cody, WY": "COD",
        "Colorado Springs, CO": "COS",
        "Columbia, MO": "COU",
        "Casper, WY": "CPR",
        "Corpus Christi, TX": "CRP",
        "Charleston, WV": "CRW",
        "Columbus, GA": "CSG",
        "Cincinnati, OH": "CVG",
        "Cheyenne, WY": "CYS",
        "Daytona Beach, FL": "DAB",
        "Dallas, TX (Love Field)": "DAL",
        "Dayton, OH": "DAY",
        "Dubuque, IA": "DBQ",
        "Washington, DC (Reagan)": "DCA",
        "Dodge City, KS": "DDC",
        "Decatur, IL": "DEC",
        "Denver, CO": "DEN",
        "Dallas/Fort Worth, TX": "DFW",
        "Dothan, AL": "DHN",
        "Dickinson, ND": "DIK",
        "Duluth, MN": "DLH",
        "Durango, CO": "DRO",
        "Del Rio, TX": "DRT",
        "Des Moines, IA": "DSM",
        "Detroit, MI": "DTW",
        "Devils Lake, ND": "DVL",
        "Kearney, NE": "EAR",
        "Wenatchee, WA": "EAT",
        "Eau Claire, WI": "EAU",
        "Panama City, FL": "ECP",
        "Eagle/Vail, CO": "EGE",
        "Elko, NV": "EKO",
        "Elmira/Corning, NY": "ELM",
        "El Paso, TX": "ELP",
        "Erie, PA": "ERI",
        "Escanaba, MI": "ESC",
        "Eugene, OR": "EUG",
        "Evansville, IN": "EVV",
        "New Bern, NC": "EWN",
        "Newark, NJ": "EWR",
        "Key West, FL": "EYW",
        "Fargo, ND": "FAR",
        "Fresno, CA": "FAT",
        "Fayetteville, NC": "FAY",
        "Flagstaff, AZ": "FLG",
        "Fort Lauderdale, FL": "FLL",
        "Florence, SC": "FLO",
        "Flint, MI": "FNT",
        "Fort Dodge, IA": "FOD",
        "Sioux Falls, SD": "FSD",
        "Fort Smith, AR": "FSM",
        "Fort Wayne, IN": "FWA",
        "Gillette, WY": "GCC",
        "Garden City, KS": "GCK",
        "Spokane, WA": "GEG",
        "Grand Forks, ND": "GFK",
        "Longview, TX": "GGG",
        "Grand Junction, CO": "GJT",
        "Gainesville, FL": "GNV",
        "Gulfport/Biloxi, MS": "GPT",
        "Green Bay, WI": "GRB",
        "Grand Island, NE": "GRI",
        "Killeen/Fort Hood, TX": "GRK",
        "Grand Rapids, MI": "GRR",
        "Greensboro/High Point, NC": "GSO",
        "Greenville/Spartanburg, SC": "GSP",
        "Great Falls, MT": "GTF",
        "Columbus/Tupelo, MS": "GTR",
        "Gunnison/Crested Butte, CO": "GUC",
        "Hayden/Steamboat Springs, CO": "HDN",
        "Hagerstown, MD": "HGR",
        "Hibbing/Chisholm, MN": "HIB",
        "Helena, MT": "HLN",
        "Houston, TX (Hobby)": "HOU",
        "White Plains, NY": "HPN",
        "Harlingen, TX": "HRL",
        "Huntsville, AL": "HSV",
        "Huntington, WV": "HTS",
        "New Haven, CT": "HVN",
        "Hyannis, MA": "HYA",
        "Hays, KS": "HYS",
        "Washington, DC (Dulles)": "IAD",
        "Niagara Falls, NY": "IAG",
        "Houston, TX (Intercontinental)": "IAH",
        "Wichita, KS": "ICT",
        "Idaho Falls, ID": "IDA",
        "Wilmington, DE": "ILG",
        "Wilmington, NC": "ILM",
        "Iron Mountain, MI": "IMT",
        "Indianapolis, IN": "IND",
        "International Falls, MN": "INL",
        "Williamsport, PA": "IPT",
        "Williston, ND": "ISN",
        "Islip, NY": "ISP",
        "Ithaca, NY": "ITH",
        "Jackson Hole, WY": "JAC",
        "Jackson, MS": "JAN",
        "Jacksonville, FL": "JAX",
        "New York (JFK)": "JFK",
        "Joplin, MO": "JLN",
        "Jamestown, ND": "JMS",
        "Johnstown, PA": "JST",
        "Lansing, MI": "LAN",
        "Las Vegas, NV": "LAS",
        "Lawton, OK": "LAW",
        "Los Angeles, CA": "LAX",
        "Lubbock, TX": "LBB",
        "North Platte, NE": "LBF",
        "Liberal, KS": "LBL",
        "Lake Charles, LA": "LCH",
        "Lexington, KY": "LEX",
        "Lafayette, LA": "LFT",
        "New York (LGA)": "LGA",
        "Long Beach, CA": "LGB",
        "Little Rock, AR": "LIT",
        "Lincoln, NE": "LNK",
        "Laredo, TX": "LRD",
        "La Crosse, WI": "LSE",
        "Lewiston, ID": "LWS",
        "Lynchburg, VA": "LYH",
        "Midland/Odessa, TX": "MAF",
        "Saginaw/Bay City/Midland, MI": "MBS",
        "Kansas City, MO": "MCI",
        "Orlando, FL": "MCO",
        "Mason City, IA": "MCW",
        "Harrisburg, PA": "MDT",
        "Chicago (Midway), IL": "MDW",
        "Meridian, MS": "MEI",
        "Memphis, TN": "MEM",
        "McAllen, TX": "MFE",
        "Medford, OR": "MFR",
        "Montgomery, AL": "MGM",
        "Manhattan/Ft. Riley, KS": "MHK",
        "Manchester, NH": "MHT",
        "Miami, FL": "MIA",
        "Milwaukee, WI": "MKE",
        "Muskegon, MI": "MKG",
        "Melbourne, FL": "MLB",
        "Moline/Quad Cities, IL": "MLI",
        "Monroe, LA": "MLU",
        "Mobile, AL": "MOB",
        "Minot, ND": "MOT",
        "Monterey, CA": "MRY",
        "Madison, WI": "MSN",
        "Missoula, MT": "MSO",
        "Minneapolis/St. Paul, MN": "MSP",
        "New Orleans, LA": "MSY",
        "Montrose/Telluride, CO": "MTJ",
        "Martha's Vineyard, MA": "MVY",
        "Myrtle Beach, SC": "MYR",
        "Jacksonville/Camp Lejeune, NC": "OAJ",
        "Oakland, CA": "OAK",
        "Ogden, UT": "OGD",
        "Oklahoma City, OK": "OKC",
        "Omaha, NE": "OMA",
        "Ontario, CA": "ONT",
        "Chicago (O'Hare), IL": "ORD",
        "Norfolk, VA": "ORF",
        "Worcester, MA": "ORH",
        "North Bend/Coos Bay, OR": "OTH",
        "Owensboro, KY": "OWB",
        "Everett, WA": "PAE",
        "Paducah, KY": "PAH",
        "Plattsburgh, NY": "PBG",
        "West Palm Beach, FL": "PBI",
        "Portland, OR": "PDX",
        "Punta Gorda, FL": "PGD",
        "Newport News/Williamsburg, VA": "PHF",
        "Philadelphia, PA": "PHL",
        "Phoenix, AZ": "PHX",
        "Peoria, IL": "PIA",
        "Hattiesburg/Laurel, MS": "PIB",
        "St. Pete/Clearwater, FL": "PIE",
        "Pocatello, ID": "PIH",
        "Pierre, SD": "PIR",
        "Pittsburgh, PA": "PIT",
        "Pellston, MI": "PLN",
        "Pensacola, FL": "PNS",
        "Prescott, AZ": "PRC",
        "Pasco/Tri-Cities, WA": "PSC",
        "Portsmouth, NH": "PSM",
        "Palm Springs, CA": "PSP",
        "Pueblo, CO": "PUB",
        "Pullman/Moscow, WA": "PUW",
        "Providence, RI": "PVD",
        "Provo, UT": "PVU",
        "Plainview, TX": "PVM",
        "Rapid City, SD": "RAP",
        "Redding, CA": "RDD",
        "Redmond/Bend, OR": "RDM",
        "Raleigh/Durham, NC": "RDU",
        "Rockford, IL": "RFD",
        "Rhinelander, WI": "RHI",
        "Richmond, VA": "RIC",
        "Riverton, WY": "RIW",
        "Rock Springs, WY": "RKS",
        "Reno, NV": "RNO",
        "Roanoke, VA": "ROA",
        "Rochester, NY": "ROC",
        "Roswell, NM": "ROW",
        "Rochester, MN": "RST",
        "Fort Myers, FL": "RSW",
        "Santa Fe, NM": "SAF",
        "San Diego, CA": "SAN",
        "San Antonio, TX": "SAT",
        "Savannah, GA": "SAV",
        "Santa Barbara, CA": "SBA",
        "South Bend, IN": "SBN",
        "San Luis Obispo, CA": "SBP",
        "Stockton, CA": "SCK",
        "Louisville, KY": "SDF",
        "Seattle, WA": "SEA",
        "Orlando/Sanford, FL": "SFB",
        "San Francisco, CA": "SFO",
        "Springfield/Branson, MO": "SGF",
        "St. George, UT": "SGU",
        "Sheridan, WY": "SHR",
        "Shreveport, LA": "SHV",
        "San Jose, CA": "SJC",
        "San Angelo, TX": "SJT",
        "Salt Lake City, UT": "SLC",
        "Salina, KS": "SLN",
        "Sacramento, CA": "SMF",
        "Santa Maria, CA": "SMX",
        "Santa Ana/Orange County, CA": "SNA",
        "Springfield, IL": "SPI",
        "Wichita Falls, TX": "SPS",
        "Sarasota/Bradenton, FL": "SRQ",
        "St. Cloud, MN": "STC",
        "St. Louis, MO": "STL",
        "Santa Rosa, CA": "STS",
        "Sioux City, IA": "SUX",
        "Stillwater, OK": "SWO",
        "Syracuse, NY": "SYR",
        "Terre Haute, IN": "TBN",
        "Tallahassee, FL": "TLH",
        "Toledo, OH": "TOL",
        "Tampa, FL": "TPA",
        "Bristol/Johnson City/Kingsport, TN": "TRI",
        "Trenton, NJ": "TTN",
        "Tulsa, OK": "TUL",
        "Tucson, AZ": "TUS",
        "Traverse City, MI": "TVC",
        "Twin Falls, ID": "TWF",
        "Texarkana, AR": "TXK",
        "Tyler, TX": "TYR",
        "Knoxville, TN": "TYS",
        "Quincy, IL": "UIN",
        "Victoria, TX": "VCT",
        "Vernal, UT": "VEL",
        "Valdosta, GA": "VLD",
        "Valparaiso, FL": "VPS",
        "Fayetteville/Springdale, AR": "XNA",
        "Wasilla, AK": "XWA",
        "Yakima, WA": "YKM",
    };

    const [departureAirport, setDepartureAirport] = useState(null);
    const [arrivalAirport, setArrivalAirport] = useState(null);
    const [selectedAirportCode, setSelectedAirportCode] = useState('');
    const [selectedAirportCodeArrival, setSelectedAirportCodeArrival] = useState('');

    // Convert airportCodes to options for react-select
    const options = Object.keys(airportCodes).map((airport) => ({
        value: airport,
        label: `${airport}`, // Main label
        subLabel: `${airportCodes[airport]} - ${airport}`, // Secondary label
      }));
    
    // Custom render function for options
    const formatOptionLabel = ({ label, subLabel }) => (
    <div>
      <div>{label}</div> {/* Main label */}
      <div style={{ fontSize: '0.8rem', color: '#666' }}>{subLabel}</div> {/* Smaller secondary label */}
    </div>
    );

    // Handle departure airport selection
    const handleDepartureChange = (selectedOption) => {
        setDepartureAirport(selectedOption);
        if (selectedOption) {
        setSelectedAirportCode(selectedOption.value); // Save airport code
        } else {
        setSelectedAirportCode(''); // Reset if no selection
        }
    };

    // Handle arrival airport selection
    const handleArrivalChange = (selectedOption) => {
        setArrivalAirport(selectedOption);
        if (selectedOption) {
        setSelectedAirportCodeArrival(selectedOption.value); // Save airport code
        } else {
        setSelectedAirportCodeArrival(''); // Reset if no selection
        }
    };

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
        <ParallaxTilt className='xs:w-[250px] w-full'>
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
        </ParallaxTilt>
        )
    }

    // Check the calendar
    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const toggleDropdownCalendar = () => setIsOpenCalendar(!isOpenCalendar);
    

    // Fetch the API search query from the backend for real-time flights
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);     // Set a state for the posts

    // Tracks if search was triggered
    const [hasSearched, setHasSearched] = useState(false);

    // Fetch if the trip was a round-trip or a one-way trip
    const[tripType, setTripType] = useState(1);

    const handleSearch = () => {
        // Grab the search query results from user
        const params = {
            departure_id: selectedAirportCode,
            arrival_id: selectedAirportCodeArrival,
            outbound_date: startDate ? startDate.toISOString().split('T')[0] : undefined,
            return_date: endDate ? endDate.toISOString().split('T')[0] : undefined,
            currency: currency,
            type: tripType,
        };

        // Modify the params based on the tripType
        if(tripType !== 2) {
            params.return_date = endDate ? endDate.toISOString().split('T')[0] : undefined;
        }

        console.log("Trip Type: ", tripType)
        console.log("CORRECTLY grabbing query")
        console.log(params)

        // Mark that a search has been made
        setHasSearched(true);

        // Set the serverUrls
        const serverUrl = import.meta.env.VITE_SERVER_NODE_URL;

        // Debugging
        const queryString = new URLSearchParams(params).toString();
        console.log(`Full Request URL: ${serverUrl}/fetch-flights?${queryString}`);

        axios.get(`${serverUrl}/fetch-flights`, { params })
            .then(response => {
                // Get the best flight results from the API call
                setResults(response.data.best_flights);
                console.log("BEST RESULTSSSSSS ------------------------")
                console.log(response.data.best_flights)
                setError(null);
            })
            .catch(err => {
                console.error('Error:', err.response ? err.response.data : err.message);
                setError('Failed to fetch search results.');
                setResults(null);
            });
    };

    // Log hasSearched after it changes
    useEffect(() => {
        console.log("SEARCH: ", hasSearched);
    }, [hasSearched]); // Only runs when `hasSearched` changes

    function formatDate(dateString) {
        const date = new Date(dateString); // Create a Date object
        const options = { month: 'long', day: 'numeric' }; // Specify format options
        return date.toLocaleDateString('en-US', options); // Format the date
      }
      
      function splitDateTime(datetime) {
        console.log("datetime:", datetime); // Log the input datetime to check if it's correct
        const [date, time] = datetime.split(' ');
        const formattedDate = formatDate(date); // Convert the date into "Month Day" format
        return { date: formattedDate, time };
      }

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
                                <a 
                                    className="hover:text-blue-400"
                                    onClick={() => setTripType(2)}
                                >
                                    One-way
                                </a>
                            </li>
                            <li className='hover:border-b-2 hover:border-blue-400 hover:bg-transparent'>
                                <a 
                                    className="hover:text-blue-400"
                                    onClick={() => setTripType(1)}
                                >
                                    Roundtrip
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Departure Airport Select */}
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                        <span className="label-text">Leaving from?</span>
                        </div>
                        <Select
                        options={options}
                        placeholder="Leaving from"
                        value={departureAirport}
                        onChange={(selectedOption) => setDepartureAirport(selectedOption)}
                        formatOptionLabel={formatOptionLabel} // Custom render function
                        className="react-select-container"
                        classNamePrefix="react-select"
                        />
                    </label>

                    {/* Swap Arrow Icon */}
                    <button 
                    className="btn btn-circle btn-outline"
                    onClick={swapAirports}
                    title="Swap airports"
                    style={{ marginTop: '36px' }} /* Adjust this value as needed */
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

                    {/* Arrival Airport Select */}
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                        <span className="label-text">Going to?</span>
                        </div>
                        <Select
                        options={options}
                        placeholder="Going to"
                        value={arrivalAirport}
                        onChange={(selectedOption) => setArrivalAirport(selectedOption)}
                        formatOptionLabel={formatOptionLabel} // Custom render function
                        className="react-select-container"
                        classNamePrefix="react-select"
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
                    {results && results.length > 0 && (
                        <h1 className="mb-5 text-5xl font-bold">Best Flight Results</h1>
                    )}

                    {!results && hasSearched ? (
                        <p className="mt-40 text-center text-gray-500">No options match your search.</p>
                    ) : results && results.length > 0 ? (
                        results.map((flight, index) => (
                        

                        <div key={index} className="collapse collapse-arrow bg-base-200 rounded-lg shadow-lg mb-4">
                            <input type="checkbox" name="my-accordion-2"/>
                            <div className="collapse-title text-xl font-medium flex items-center space-x-4 py-4">
                                <img src={flight.airline_logo} alt={flight.flights[0].airline} width="50" />
                                <div className="flex-grow">
                                    <h2 className="font-semibold">{flight.flights[0].airline} - {flight.flights[0].flight_number}</h2>
                                    <p className="text-sm text-gray-500">{flight.flights[0].departure_airport.time}</p>
                                </div>
                                <span className="font-semibold text-gray-800">{currencySymbols[currency] || ''}{flight.price}</span>
                            </div>

                            <div className="collapse-content p-4 space-y-4 bg-white rounded-lg shadow-lg">

                            <div className="entireTrip">
                                {flight.flights.map((flightDetails, index) => (
                                    <div key={index}>
                                    <div className="space-y-6"> {/* This adds vertical spacing between child divs */}
                                     
                                     
                                     {/* Departure Section */}
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21l-2-2m0 0l-2-2m2-2l2-2m-2 2V3a2 2 0 00-2-2H7a2 2 0 00-2 2v14l-2 2h16z" />
                                            </svg>
                                            <p className="text-lg font-semibold">Departure</p>
                                        </div>

                                        {/* Aligning airport name to the left & formatted date to the right */}
                                        <div className="flex justify-between items-center pl-7">
                                            <p className="flex-1">{flightDetails.departure_airport.name}</p>
                                            <p className="text-gray-600">
                                                {splitDateTime(flightDetails.departure_airport.time).date} 
                                                <span className="ml-2">{splitDateTime(flightDetails.departure_airport.time).time}</span>
                                            </p>
                                        </div>

                                    </div>


                                        {/* Arrival Section */}
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-2 2m0 0l-2 2m2-2h-7l-4 4V5l4 4h7z" />
                                                </svg>
                                                <p className="text-lg font-semibold">Arrival</p>
                                            </div>

                                            <div className="flex justify-between items-center pl-7">
                                                <p className="flex-1">{flightDetails.arrival_airport.name}</p>
                                                <p className="text-gray-600">
                                                    {splitDateTime(flightDetails.arrival_airport.time).date} 
                                                    <span className="ml-2">{splitDateTime(flightDetails.arrival_airport.time).time}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Layover Section - Added between flights */}
                                    {index < flight.flights.length - 1 && flight.layovers?.[index] && (
                                        <div className="space-y-3 text-center">
                                            <div className="flex items-center justify-center space-x-2 text-black">
                                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3H6v4H2v2h4v4h2V9h4V7h-4z" />
                                                </svg> */}
                                                <div className='w-full flex flex-col space-y-2 pt-3 pb-3'> 
                                                    <hr className="border-t border-gray-300" />
                                                    <p className="text-sm font-semibold">
                                                        {flight.layovers[index].duration} min layover ⋅ {flight.flights[index].arrival_airport.name}
                                                    </p>
                                                    <hr className="border-t border-gray-300" />
                                                </div>
                    
                                            </div>
                                        </div>
                                    )}

                                    </div>



                                ))}
                            </div>

                            {/* Duration Section */}
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3H6v4H2v2h4v4h2V9h4V7h-4z" />
                                </svg>
                                <p className="text-lg font-semibold">Duration</p>
                                </div>
                                <p className="pl-7">{flight.total_duration} minutes</p>
                            </div>

                            {/* Carbon Emissions Section */}
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4v16h18V4H3zm2 2h14v12H5V6zm5 8h4v2h-4z" />
                                </svg>
                                <p className="text-lg font-semibold">Carbon Emissions Estimate</p>
                                </div>
                                <p className="pl-7">{flight.carbon_emissions.this_flight} g</p>
                            </div>

                            {/* Travel Class Section */}
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3H6v4H2v2h4v4h2V9h4V7h-4z" />
                                </svg>
                                <p className="text-lg font-semibold">Travel Class</p>
                                </div>
                                <p className="pl-7">{flight.flights[0].travel_class}</p>
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
                        <p></p>
                    )}
                </div>
                
            </div>

            {/* Create a div for the Popups cards */}
            <div className='mt-40 flex flex-wrap gap-6 justify-center'>
                {/* Ask Jetset AI Popup */}
                <ParallaxTilt className='w-[200px] sm:w-[220px]'>
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
                            <h3 className='text-black text-[20px] font-bold text-center'>flightforesight</h3>
                        </div>
                    </motion.div>
                </ParallaxTilt>

                {/* Best time to travel Popup */}
                <ParallaxTilt className='w-[200px] sm:w-[220px]'>
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
                </ParallaxTilt>

                {/* Explore Popup */}
                <ParallaxTilt className='w-[200px] sm:w-[220px]'>
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
                </ParallaxTilt>

                {/* Price Change Popup */}
                <ParallaxTilt className='w-[200px] sm:w-[220px]'>
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
                </ParallaxTilt>

                {/* Trips Popup */}
                <ParallaxTilt className='w-[200px] sm:w-[220px]'>
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
                </ParallaxTilt>

                {/* Flight Tracker Popup */}
                <ParallaxTilt className='w-[200px] sm:w-[220px]'>
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
                </ParallaxTilt>
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
                jetSet
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
