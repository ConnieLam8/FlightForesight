import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";
import axios from "axios";
import robotIcon from '../images/robot-icon.png';
import userIcon from '../images/user-profile.jpg';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Set the server url from the back-end service
const serverUrl = import.meta.env.VITE_SERVER_NODE_URL;

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I can help predict your flight delay. Let's start with the name of your airline.", isBot: true }
    ]);
    const [currentStep, setCurrentStep] = useState(0);
    const [flightDetails, setFlightDetails] = useState({
        Airline_Name: "",
        full_Origin_Airport_Name: "",
        full_Dest_Airport_Name: "",
        departureDate: null,
        crs_dep_military_date: "",
        crs_arr_military_date: ""
    });

    const steps = [
        { key: "Airline_Name", prompt: "Please provide the Airline Name." },
        { key: "full_Origin_Airport_Name", prompt: "What is the origin airport name?" },
        { key: "full_Dest_Airport_Name", prompt: "What is the destination airport name?" },
        { key: "departureDate", prompt: "What is the departure Date? (Format:MM-DD-YYYY)" },
        { key: "crs_dep_military_date", prompt: "What is the scheduled departure time? (Format:HH:MM)" },
        { key: "crs_arr_military_date", prompt: "What is the scheduled arrival time? (Format:HH:MM)" }
    ];


    const [suggestions, setSuggestions] = useState([]);
    const handleDateChange = (date) => {
        if (!date) return;

        const formattedDate = date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        }); // Converts to MM/DD/YYYY

        handleUserResponse(formattedDate); // Pass to `handleUserResponse`
    };

    const fetchSuggestions = async (input, stepKey) => {
        const endpoint = stepKey === "Airline_Name"
            // ? 'http://localhost:5001/autocompleteAirline'
            ? `${serverUrl}/autocompleteAirline`
            : stepKey === "full_Origin_Airport_Name"
                // ? "http://localhost:5001/autocompleteOriginAirport"
                ? `${serverUrl}/autocompleteOriginAirport`
                // : "http://localhost:5001/autocompleteDestAirport"; // default for other cases (e.g., Dest_Airport_Name)
                : `${serverUrl}/autocompleteDestAirport`; // default for other cases (e.g., Dest_Airport_Name)

        try {
            const response = await axios.post(endpoint, { query: input });
            setSuggestions(response.data.suggestions || []);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleInputChange = (e) => {
        const userInput = e.target.value.trim();
        const currentKey = steps[currentStep].key;

        if (!userInput) {
            setSuggestions([]); // Clear when input is empty
            return;
        }

        // Fetch suggestions only if the step requires it
        if (["Airline_Name", "full_Origin_Airport_Name", "full_Dest_Airport_Name"].includes(currentKey)) {
            fetchSuggestions(userInput, currentKey);
        } else {
            setSuggestions([]); // Ensure suggestions are cleared for other inputs
        }
    };
    const [results, setResults] = useState(null);

    const inputRef = useRef(null); // Create a ref for the input field
    const messageEndRef = useRef(null); // Create a ref for the scroll target

    // Auto-scroll logic for the chat to scroll down when a new message appears
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, results]); // Scrolls whenever messages or results update

    const handleUserResponse = async (input) => {
        const currentKey = steps[currentStep].key;

        // Update flight details
        setFlightDetails((prev) => ({ ...prev, [currentKey]: input }));
        // Add user's response to messages
        setMessages((prev) => [...prev, { text: input, isBot: false }]);

        if (currentKey === "Airline_Name") {
            // Verify the DOT Code with the backend
            try {
                // const response = await axios.post("http://localhost:5001/verifyAirlineName", { Airline_Name: input });
                const response = await axios.post(`${serverUrl}/verifyAirlineName`, { Airline_Name: input });
                if (response.data.valid) {
                    // Proceed to the next step
                    if (currentStep < steps.length - 1) {
                        setCurrentStep((prev) => prev + 1);
                        setMessages((prev) => [...prev, { text: steps[currentStep + 1].prompt, isBot: true }]);
                    }
                } else {
                    setMessages((prev) => [
                        ...prev,
                        { text: response.data.message, isBot: true }
                    ]);
                }
            } catch (error) {
                setMessages((prev) => [
                    ...prev,
                    { text: "Error verifying airline name. Please try again.", isBot: true }
                ]);
            }
        } else if (currentKey === "full_Origin_Airport_Name") {
            try {
                // const response1 = await axios.post("http://localhost:5001/verifyOriginAirportName", { full_Origin_Airport_Name: input });
                const response1 = await axios.post(`${serverUrl}/verifyOriginAirportName`, { full_Origin_Airport_Name: input });
                if (response1.data.valid) {
                    // Proceed to the next step
                    if (currentStep < steps.length - 1) {
                        setCurrentStep((prev) => prev + 1);
                        setMessages((prev) => [...prev, { text: steps[currentStep + 1].prompt, isBot: true }]);
                    }
                } else {
                    setMessages((prev) => [
                        ...prev,
                        { text: response1.data.message, isBot: true }
                    ]);
                }
            } catch (error) {
                setMessages((prev) => [
                    ...prev,
                    { text: "Error verifying airport name. Please try again.", isBot: true }
                ]);
            }
        } else if (currentKey === "full_Dest_Airport_Name") {
            try {
                // const response2 = await axios.post("http://localhost:5001/verifyDestAirportName", { full_Dest_Airport_Name: input });
                const response2 = await axios.post(`${serverUrl}/verifyDestAirportName`, { full_Dest_Airport_Name: input });
                if (response2.data.valid) {
                    // Proceed to the next step
                    if (currentStep < steps.length - 1) {
                        setCurrentStep((prev) => prev + 1);
                        setMessages((prev) => [...prev, { text: steps[currentStep + 1].prompt, isBot: true }]);
                    }
                } else {
                    setMessages((prev) => [
                        ...prev,
                        { text: response2.data.message, isBot: true }
                    ]);
                }
            } catch (error) {
                setMessages((prev) => [
                    ...prev,
                    { text: "Error verifying airport name. Please try again.", isBot: true }
                ]);
            }

        }
        else if (currentKey === "departureDate") {
            try {
                const response5 = await axios.post(`${serverUrl}/verifydepartureDate`, {departureDate: input});
                if (response5.data.valid) {
                    // Proceed to the next step
                    if (currentStep < steps.length - 1) {
                        setCurrentStep((prev) => prev + 1);
                        setMessages((prev) => [...prev, {text: steps[currentStep + 1].prompt, isBot: true}]);
                    }
                } else {
                    setMessages((prev) => [
                        ...prev,
                        {text: response5.data.message, isBot: true}]);
                    setFlightDetails((prev) => ({ ...prev, departureDate: null }));

                }
            }catch (error) {
                    setMessages((prev) => [
                        ...prev,
                        { text: "Invalid Date Format . Please try again.", isBot: true }
                    ]);
                setFlightDetails((prev) => ({ ...prev, departureDate: null }));
                }
            }

        else if (currentKey === "crs_dep_military_date") {
            try {
                // const response3 = await axios.post("http://localhost:5001/verifyDepdate", { crs_dep_military_date: input });
                const response3 = await axios.post(`${serverUrl}/verifyDepdate`, { crs_dep_military_date: input });
                if (response3.data.valid) {
                    // Proceed to the next step
                    if (currentStep < steps.length - 1) {
                        setCurrentStep((prev) => prev + 1);
                        setMessages((prev) => [...prev, { text: steps[currentStep + 1].prompt, isBot: true }]);
                    }
                } else {
                    setMessages((prev) => [
                        ...prev,
                        { text: response3.data.message, isBot: true }
                    ]);
                }
            } catch (error) {
                setMessages((prev) => [
                    ...prev,
                    { text: "Invalid Time Format. Please try again.", isBot: true }
                ]);
            }
        } else if (currentKey === "crs_arr_military_date") {
            try {
                // const response4 = await axios.post("http://localhost:5001/verifyArrdate", { crs_arr_military_date: input });
                const response4 = await axios.post(`${serverUrl}/verifyArrdate`, { crs_arr_military_date: input });
                if (response4.data.valid) {
                    // Display the results in the chatbot
                    setResults(response4.data.results);
                    setMessages((prev) => [
                        ...prev,
                        // { text: "Here are the results:", isBot: true },
                        // { text: JSON.stringify(response4.data.results, null, 2), isBot: true }
                    ]);
                } else {
                    setMessages((prev) => [
                        ...prev,
                         { text: response4.data.message, isBot: true }
                    ]);
                }
            } catch (error) {
                setMessages((prev) => [
                    ...prev,
                    { text: "Invalid Time Format. Please try again.", isBot: true }
                ]);
            }
        } else {
            // Proceed to the next step without verification
            if (currentStep < steps.length - 1) {
                setCurrentStep((prev) => prev + 1);
                setMessages((prev) => [...prev, { text: steps[currentStep + 1].prompt, isBot: true }]);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userInput = e.target.userInput.value.trim();
        e.target.reset();
        if (userInput) {
            handleUserResponse(userInput);
        }
    };


    const formatResults = (results) => {
        const { regression_result } = results;
        if (regression_result > 0) {
            return `The flight will be ${Math.abs(regression_result).toFixed(2)} minutes early.`;
        } else if (regression_result < 0) {
            return `The flight will be ${regression_result.toFixed(2)} minutes late.`;
        } else {
            return "The flight is on time.";
        }
    };
    return (
        <div className="chatbot-container">
            <div className="chatbot-window">
                <div className="chatbot-messages space-y-4">
                    {messages.map((msg, index) => (
                        // <div key={index} className={`message ${msg.isBot ? "bot" : "user"}`}>
                        <div key={index} className={`chat ${msg.isBot ? "chat-start" : "chat-end"}`}>
                            {/* Avatar Section */}
                            <div className="chat-image avatar">
                                <div className="w-14 rounded-full">
                                    <img
                                        src={msg.isBot 
                                            ? robotIcon // Chatbot Avatar
                                            : userIcon // User Avatar
                                        }
                                        alt={msg.isBot ? "Chatbot Avatar" : "User Avatar"}
                                    />
                                </div>
                            </div>

                            {/* Chat Section */}
                            <div
                                className={`chat-bubble ${msg.isBot ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {results && (
                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        src={robotIcon}
                                        alt="Chatbot Avatar"
                                    />
                                </div>
                            </div>
                            <div className="chat-bubble bg-blue-500 text-white">{formatResults(results)}</div>
                        </div>
                    )}
                    
                    {/* Add an invisible scroll element */}
                    <div ref={messageEndRef} />
                </div>

                <form 
                    onSubmit={handleSubmit}
                    className="chatbot-form flex items-center gap-2 p-4"
                >
                    {steps[currentStep].key === "departureDate" ? (
                            <DatePicker
                                selected={flightDetails.departureDate}
                                onChange={handleDateChange}
                                 dateFormat="MM/dd/yyyy"
                                className="input input-bordered w-full max-w-xs"
                                disabled={!!flightDetails.departureDate}
                            />
                    ) : (
                    <input
                        ref={inputRef} // Attach ref here
                        type="text"
                        name="userInput"
                        placeholder="Type your response..."
                        onChange={handleInputChange}
                        className="input input-bordered w-full max-w-xs"
                        required
                        autocomplete="off"
                    />
                    )}
                    {suggestions.length > 0 && (
                        <ul className="suggestions-dropdown">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        handleUserResponse(suggestion); // Handle suggestion click
                                        setSuggestions([]); // Clear suggestions
                                        if (inputRef.current) {
                                            inputRef.current.value = ''; // Clear input field
                                        }
                                    }}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button 
                        type="submit"
                        className="btn w-[100px] h-[50px] rounded-md text-white bg-blue-800 hover:bg-blue-1000"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;
