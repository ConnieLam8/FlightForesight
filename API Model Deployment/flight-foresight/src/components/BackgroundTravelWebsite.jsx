import React, { useRef, useEffect, useState } from 'react';
import planeImage from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/airplane-7-64.png';
import signInLogo from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/—Pngtree—avatar icon profile icon member_5247852.png';
import likedFlights from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/610189e478192d00042edc31.png'; 
import jetsetAI from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/askAI.png';
import timeToTravel from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/bestTimetoTravel.png';
import exploreImage from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/explore.png';
import priceChange from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/priceChange.png';
import flightTrackerImage from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/flightTrackerImage.png'; 
import tripImage from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/tripsImage.png'; 
import arrowImage from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/arrow.png';
import searchIcon from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/magnifying-glass-3-64.png';
import cancunInfo from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/cancun.png';
import floridaInfo from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/maimi.png';
import losAngelesInfo from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/losangeles.png';
import vancouverInfo from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/vancouver.png'; 
import newyorkInfo from '/Users/mehreenaiman/Documents/GitHub/FlightForesight/API Model Deployment/flight-foresight/src/images/newyork.png'; 

const BackgroundTravelWebsite = () => {
    const [isHovered1, setIsHovered1] = React.useState (false);
    const [isHovered2, setIsHovered2] = React.useState (false);
    const [isHovered3, setIsHovered3] = React.useState (false);
    const [isHovered4, setIsHovered4] = React.useState (false);
    const [isHovered5, setIsHovered5] = React.useState (false);
    const [isHovered6, setIsHovered6] = React.useState (false);
    const [isHovered7, setIsHovered7] = React.useState (false);
    const [isHovered8, setIsHovered8] = React.useState (false);
    
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

    // Apply body styles on mount
    useEffect(() => {
        document.body.style.backgroundColor = 'rgb(241, 241, 244)'; // White
        document.body.style.fontFamily = 'Arial, sans-serif';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.color = '#333';

    }, []); // Empty dependency array means it runs only once when the component mounts

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {/* Header section */}
            <div style={{
                backgroundColor: 'rgb(251, 251, 251)',  
                color: '#000000',            
                display: 'flex',             // Use flexbox for alignment
                justifyContent: 'space-between', // Spread items to opposite ends
                alignItems: 'center',        // Vertically align items
                padding: '10px 20px',        // Add padding for spacing
                borderBottom: '15px solid #000080' // Thin black line under the header
            }}>
                {/* Left section (Logo and Title) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
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

                {/* Right section (Liked Flights and Sign-In) */}
                <div style={{
                    display: 'flex', // Use flexbox for alignment
                    alignItems: 'center', // Vertically align items
                    gap: '10px' // Space between the images
                }}>
                    <img 
                        src={likedFlights} 
                        alt="Liked Flights" 
                        style={{
                            width: '40px', 
                            height: 'auto'
                        }}    
                    />
                    <img 
                        src={signInLogo} 
                        alt="Sign In" 
                        style={{
                            width: '80px', 
                            height: 'auto'
                        }}    
                    />
                </div>
            </div>

                {/* Light Grey Rectangle below the header */}
                <div style={{
                    backgroundColor: 'rgb(226, 226, 228)', // Light Grey
                    height: '300px',            // Height of the rectangle (increased to accommodate search boxes)
                    marginTop: '70px',          // Adds some space between the header and the rectangle
                    marginRight: '20px', 
                    marginLeft: '20px',
                    width: '93%',              // Full width of the screen
                    padding: '20px',            // Adds padding inside the rectangle
                    textAlign: 'center',
                    borderRadius: '10px',      // Adds rounded corners
                    display: 'flex',           // Flexbox to align elements
                    flexDirection: 'column',   // Align items in a column
                    justifyContent: 'center',   // Vertically center the content inside the rectangle
                    boxShadow: isHovered1
                        ? '5px 5px 15px rgba(0, 0, 0, 0.3)' // Shadow when hovered
                        : 'none' // No shadow by default
                }}
                    onMouseEnter={() => setIsHovered1(true)} // Trigger shadow on hover
                    onMouseLeave={() => setIsHovered1(false)} // Remove shadow when not hovering
                >
                    
                <div style={{ display: 'flex' }}>
                    <h2 style={{
                        color: '#000000',
                        fontSize: '60px',
                        textAlign: 'left',
                        marginRight: '10px',
                        fontFamily: 'Bebas Neue' // Applying the font
                    }}>
                        explore the world with
                    </h2>
                    <h2 style={{
                        color: 'rgb(0,0,128)',
                        fontSize: '60px',
                        textAlign: 'left',
                        fontFamily: 'Bebas Neue' // Applying the font
                    }}>
                        jetSet.
                    </h2>
                </div>
                
                <div style={{ position: "absolute", display: "inline-block" }}>
                {/* Dropdown Button */}
                <button 
                    onClick={toggleDropdown} 
                    style={{
                        marginTop: '65px',
                        padding: "10px 15px",
                        backgroundColor: 'rgb(0,0,128)',
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        width: '150px',
                        cursor: "pointer",
                    }}
                >
                    Flight Path
                </button>

                {/* Dropdown List (Only shown when isOpen is true) */}
                {isOpen && (
                    <div style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
                        width: "150px",
                        zIndex: 10
                    }}>
                        <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
                            <li style={{ padding: "8px", cursor: "pointer" }} onClick={() => alert("Round-Trip")}>Round-Trip</li>
                            <li style={{ padding: "8px", cursor: "pointer" }} onClick={() => alert("One-Way")}>One-Way</li>
                        </ul>
                    </div>
                )}
                </div>

                {/* Search Boxes inside the grey rectangle */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <input 
                        type="text" 
                        placeholder="from?" 
                        style={{
                            width: '45%',         // Adjusted width to fit side-by-side
                            padding: '10px',      
                            borderRadius: '5px',  
                            border: '3px solid #ccc', 
                            fontSize: '16px',
                            color: 'rgb(255, 255, 255)'
                        }} 
                    />
                    <img 
                        src={arrowImage} 
                        alt="Sign In" 
                        style={{
                            width: '60px', 
                            height: 'auto'
                        }}    
                    />
                    <input 
                        type="text" 
                        placeholder="to?" 
                        style={{
                            width: '45%',         // Adjusted width to fit side-by-side
                            padding: '10px',      
                            borderRadius: '5px',  
                            border: '3px solid #ccc', 
                            fontSize: '16px',
                            color: 'rgb(255, 255, 255)'
                        }} 
                    />
                    <input 
                        type="text" 
                        placeholder="dates" 
                        style={{
                            width: '45%',         // Adjusted width to fit side-by-side
                            padding: '10px',      
                            borderRadius: '5px',  
                            border: '3px solid #ccc', 
                            fontSize: '16px',
                            color: 'rgb(255, 255, 255)'
                        }} 
                    />
                    <button onClick={() => alert('Button Clicked!')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <img 
                            src={searchIcon} 
                            alt="Clickable Button" 
                            style={{ width: '50px', height: '50px' }}
                        />
                    </button>      
                </div>
            </div>

            <div>
            {/* Light Grey Rectangle */}
            <div
                style={{
                    backgroundColor: "rgb(226, 226, 228)", 
                    height: "350px", 
                    marginTop: "70px", 
                    marginRight: "20px", 
                    marginLeft: "20px",
                    width: "93%", 
                    padding: "20px", 
                    textAlign: "center",
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    boxShadow: isHovered8 ? "5px 5px 15px rgba(0, 0, 0, 0.3)" : "none",
                }}
                onMouseEnter={() => setIsHovered8(true)}
                onMouseLeave={() => setIsHovered8(false)}
            >
                {/* Title */}
                <h2
                    style={{
                        color: "#000000",
                        fontSize: "30px",
                        textAlign: "center",
                        marginBottom: "20px",
                        fontFamily: "Bebas Neue",
                    }}
                >
                    cheap travel flight deals
                </h2>

                {/* Image Carousel */}
                <div style={{ position: "relative", width: "90%", overflow: "hidden" }}>
                    {/* Left Arrow */}
                    <button
                        onClick={scrollLeft}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                            border: "none",
                            padding: "10px",
                            cursor: "pointer",
                            borderRadius: "50%",
                            fontSize: "20px",
                        }}
                    >
                        ◀
                    </button>

                    {/* Scrollable Image Container */}
                    <div
                        ref={scrollRef}
                        style={{
                            display: "flex",
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            scrollBehavior: "smooth",
                            gap: "20px", // Adds spacing between images
                        }}
                    >
                        {[cancunInfo, floridaInfo, losAngelesInfo, vancouverInfo, newyorkInfo].map(
                            (image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt="destination"
                                    style={{
                                        width: "400px",
                                        height: "auto",
                                        borderRadius: "40px",
                                        border: '4px solid #000080', 
                                        flexShrink: 0, // Prevents images from shrinking
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = "scale(1.01)"} // Grow on hover
                                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"} // Return to normal
                                />
                            )
                        )}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={scrollRight}
                        style={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                            border: "none",
                            padding: "10px",
                            cursor: "pointer",
                            borderRadius: "50%",
                            fontSize: "20px",
                        }}
                    >
                        ▶
                    </button>
                </div>
            </div>
        </div>

            
            <div> 
                {/* PopUps Background */}
                <div style={{
                    position: 'relative',        // Makes the background a positioning reference
                    backgroundColor: 'rgb(226, 226, 228)', // Light Grey
                    height: '300px',            // Height of the rectangle
                    marginTop: '100px',         // Adds space between the header and the rectangle
                    marginRight: '0px', 
                    marginLeft: '0px',
                    width: '100%',              // Full width of the screen
                    padding: '20px',            // Adds padding inside the rectangle
                    textAlign: 'center',
                    boxShadow: '25px 25px 25px 25px rgba(124, 124, 136, 0.25)', // Adds a subtle shadow
                }}>
                    {/* PopUps- Ask jetSet*/}
                    <div style={{
                        position: 'absolute',     // Position the popup on top of the background
                        top: '50%',               // Center vertically
                        left: '10%',              // Center horizontally
                        transform: 'translate(-50%, -50%)', // Align center precisely
                        backgroundColor: 'rgb(255, 255, 255)', // White
                        height: '200px',          // Popup height
                        width: '200px',           // Popup width
                        padding: '20px',          // Adds padding inside the rectangle
                        borderRadius: '20px',     // Rounded corners for the popup
                        boxShadow: '15px 15px 15px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
                        textAlign: 'center',
                        zIndex: 10,               // Ensures the popup is above the background
                        border: '2px solid #000080',
                        boxShadow: isHovered2
                        ? '5px 5px 15px rgba(0, 0, 0, 0.3)' // Shadow when hovered
                        : 'none' // No shadow by default
                    }}
                        onMouseEnter={() => setIsHovered2(true)} // Trigger shadow on hover
                        onMouseLeave={() => setIsHovered2(false)} // Remove shadow when not hovering
                        >
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');
                    </style>
                    <h1 style={{ margin: 0, fontSize: '18px', color: 'rgb(0,0,128)',}}>ask jetSet AI</h1>
                    <img 
                        src={jetsetAI} 
                        alt="AI for jetSet" 
                        style={{
                            marginLeft: '20px',
                            width: '190px', 
                            height: 'auto'
                        }}    
                    />
                    </div>

                    {/* PopUps- best time to travel*/}
                    <div style={{
                        position: 'absolute',     // Position the popup on top of the background
                        top: '50%',               // Center vertically
                        left: '25.5%',              // Center horizontally
                        transform: 'translate(-50%, -50%)', // Align center precisely
                        backgroundColor: 'rgb(255, 255, 255)', // White
                        height: '200px',          // Popup height
                        width: '200px',           // Popup width
                        padding: '20px',          // Adds padding inside the rectangle
                        borderRadius: '20px',     // Rounded corners for the popup
                        boxShadow: '15px 15px 15px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
                        textAlign: 'center',
                        zIndex: 10,               // Ensures the popup is above the background
                        border: '2px solid #000080', 
                        boxShadow: isHovered3
                        ? '5px 5px 15px rgba(0, 0, 0, 0.3)' // Shadow when hovered
                        : 'none' // No shadow by default
                    }}
                    onMouseEnter={() => setIsHovered3(true)} // Trigger shadow on hover
                    onMouseLeave={() => setIsHovered3(false)} // Remove shadow when not hovering
                    >
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');
                    </style>
                    <h1 style={{ margin: 0, fontSize: '18px', color: 'rgb(0,0,128)',}}>what's the best time to travel?</h1>
                    <img 
                        src={timeToTravel} 
                        alt="Best time to Travel" 
                        style={{
                            marginLeft: '0px',
                            width: '160px', 
                            height: 'auto'
                        }}    
                    />
                    </div>

                    {/* PopUps- explore*/}
                    <div style={{
                        position: 'absolute',     // Position the popup on top of the background
                        top: '50%',               // Center vertically
                        left: '41%',              // Center horizontally
                        transform: 'translate(-50%, -50%)', // Align center precisely
                        backgroundColor: 'rgb(255, 255, 255)', // White
                        height: '200px',          // Popup height
                        width: '200px',           // Popup width
                        padding: '20px',          // Adds padding inside the rectangle
                        borderRadius: '20px',     // Rounded corners for the popup
                        boxShadow: '15px 15px 15px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
                        textAlign: 'center',
                        zIndex: 10,               // Ensures the popup is above the background
                        border: '2px solid #000080', 
                        boxShadow: isHovered4
                        ? '5px 5px 15px rgba(0, 0, 0, 0.3)' // Shadow when hovered
                        : 'none' // No shadow by default
                    }}
                    onMouseEnter={() => setIsHovered4(true)} // Trigger shadow on hover
                    onMouseLeave={() => setIsHovered4(false)} // Remove shadow when not hovering
                    >
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');
                    </style>
                    <h1 style={{ margin: 0, fontSize: '18px', color: 'rgb(0,0,128)',}}>explore</h1>
                    <img 
                        src={exploreImage} 
                        alt="Explore" 
                        style={{
                            marginLeft: '20px',
                            width: '170px', 
                            height: 'auto'
                        }}    
                    />
                    </div>

                    {/* PopUps- price detection*/}
                    <div style={{
                        position: 'absolute',     // Position the popup on top of the background
                        top: '50%',               // Center vertically
                        left: '56.5%',              // Center horizontally
                        transform: 'translate(-50%, -50%)', // Align center precisely
                        backgroundColor: 'rgb(255, 255, 255)', // White
                        height: '200px',          // Popup height
                        width: '200px',           // Popup width
                        padding: '20px',          // Adds padding inside the rectangle
                        borderRadius: '20px',     // Rounded corners for the popup
                        boxShadow: '15px 15px 15px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
                        textAlign: 'center',
                        zIndex: 10,               // Ensures the popup is above the background
                        border: '2px solid #000080', 
                        boxShadow: isHovered5
                        ? '5px 5px 15px rgba(0, 0, 0, 0.3)' // Shadow when hovered
                        : 'none' // No shadow by default
                    }}
                    onMouseEnter={() => setIsHovered5(true)} // Trigger shadow on hover
                    onMouseLeave={() => setIsHovered5(false)} // Remove shadow when not hovering
                    >
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');
                    </style>
                    <h1 style={{ margin: 0, fontSize: '18px', color: 'rgb(0,0,128)',}}>price change detection</h1>
                    <img 
                        src={priceChange} 
                        alt="Price Change" 
                        style={{
                            marginLeft: '20px',
                            width: '160px', 
                            height: 'auto'
                        }}    
                    />
                    </div>

                    {/* PopUps- Trips*/}
                    <div style={{
                        position: 'absolute',     // Position the popup on top of the background
                        top: '50%',               // Center vertically
                        left: '72%',              // Center horizontally
                        transform: 'translate(-50%, -50%)', // Align center precisely
                        backgroundColor: 'rgb(255, 255, 255)', // White
                        height: '200px',          // Popup height
                        width: '200px',           // Popup width
                        padding: '20px',          // Adds padding inside the rectangle
                        borderRadius: '20px',     // Rounded corners for the popup
                        boxShadow: '15px 15px 15px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
                        textAlign: 'center',
                        zIndex: 10,               // Ensures the popup is above the background
                        border: '2px solid #000080', 
                        boxShadow: isHovered6
                        ? '5px 5px 15px rgba(0, 0, 0, 0.3)' // Shadow when hovered
                        : 'none' // No shadow by default
                    }}
                    onMouseEnter={() => setIsHovered6(true)} // Trigger shadow on hover
                    onMouseLeave={() => setIsHovered6(false)} // Remove shadow when not hovering
                    >
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');
                    </style>
                    <h1 style={{ margin: 0, fontSize: '18px', color: 'rgb(0,0,128)',}}>trips</h1>
                    <img 
                        src={tripImage} 
                        alt="Liked Flights" 
                        style={{
                            marginLeft: '0px',
                            width: '210px', 
                            height: 'auto'
                        }}    
                    />
                    </div>
                    
                    {/* PopUps- Flight Tracker*/}
                    <div style={{
                        position: 'absolute',     // Position the popup on top of the background
                        top: '50%',               // Center vertically
                        left: '87.5%',              // Center horizontally
                        transform: 'translate(-50%, -50%)', // Align center precisely
                        backgroundColor: 'rgb(255, 255, 255)', // White
                        height: '200px',          // Popup height
                        width: '200px',           // Popup width
                        padding: '20px',          // Adds padding inside the rectangle
                        borderRadius: '20px',     // Rounded corners for the popup
                        boxShadow: '15px 15px 15px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
                        textAlign: 'center',
                        zIndex: 10,               // Ensures the popup is above the background
                        border: '2px solid #000080', 
                        boxShadow: isHovered7
                        ? '5px 5px 15px rgba(0, 0, 0, 0.3)' // Shadow when hovered
                        : 'none' // No shadow by default
                    }}
                    onMouseEnter={() => setIsHovered7(true)} // Trigger shadow on hover
                    onMouseLeave={() => setIsHovered7(false)} // Remove shadow when not hovering
                    >
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');
                    </style>
                    <h1 style={{ margin: 0, fontSize: '18px', color: 'rgb(0,0,128)',}}>flight tracker</h1>
                    <img 
                        src={flightTrackerImage} 
                        alt="Liked Flights" 
                        style={{
                            marginLeft: '0px',
                            width: '200px', 
                            height: 'auto'
                        }}    
                    />
                    </div>

                </div>
            </div>
 
        </div>
    );
};

export default BackgroundTravelWebsite;