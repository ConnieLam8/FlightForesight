
import React, { useState } from "react";
import "./ChatBot.css";
import axios from "axios";

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I can help predict your flight delay. Let's start with the name of your airline.", isBot: true }
    ]);
    const [currentStep, setCurrentStep] = useState(0);
    const [flightDetails, setFlightDetails] = useState({
        Airline_Name: "",
        full_Origin_Airport_Name: "",
        full_Dest_Airport_Name: "",
        crs_dep_military_date: "",
        crs_arr_military_date: ""
    });

    const steps = [
        { key: "Airline_Name", prompt: "Please provide the Airline Name." },
        { key: "full_Origin_Airport_Name", prompt: "What is the origin airport Name?" },
        { key: "full_Dest_Airport_Name", prompt: "What is the destination airport Name?" },
        { key: "crs_dep_military_date", prompt: "What is the scheduled departure time? (Format:HH:MM)" },
        { key: "crs_arr_military_date", prompt: "What is the scheduled arrival time? (Format:HH:MM)" }
    ];


    const [suggestions, setSuggestions] = useState([]);



    const fetchSuggestions = async (input, stepKey) => {
        const endpoint = stepKey === "Airline_Name"
            ? "http://localhost:5001/autocompleteAirline"
            : stepKey === "full_Origin_Airport_Name"
                ? "http://localhost:5001/autocompleteOriginAirport"
                : "http://localhost:5001/autocompleteDestAirport"; // default for other cases (e.g., Dest_Airport_Name)

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

        if (userInput) {
            fetchSuggestions(userInput, currentKey);
        } else {
            setSuggestions([]);
        }
    };
    const [results, setResults] = useState(null);


    const handleUserResponse = async (input) => {
        const currentKey = steps[currentStep].key;

        // Update flight details
        setFlightDetails((prev) => ({ ...prev, [currentKey]: input }));
        // Add user's response to messages
        setMessages((prev) => [...prev, { text: input, isBot: false }]);

        if (currentKey === "Airline_Name") {
            // Verify the DOT Code with the backend
            try {
                const response = await axios.post("http://localhost:5001/verifyAirlineName", { Airline_Name: input });
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
                const response1 = await axios.post("http://localhost:5001/verifyOriginAirportName", { full_Origin_Airport_Name: input });
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
                const response2 = await axios.post("http://localhost:5001/verifyDestAirportName", { full_Dest_Airport_Name: input });
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
        } else if (currentKey === "crs_dep_military_date") {
            try {
                const response3 = await axios.post("http://localhost:5001/verifyDepdate", { crs_dep_military_date: input });
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
                    { text: "Error verifying Date. Please try again.", isBot: true }
                ]);
            }
        } else if (currentKey === "crs_arr_military_date") {
            try {
                const response4 = await axios.post("http://localhost:5001/verifyArrdate", { crs_arr_military_date: input });
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
                    { text: "Error verifying Date. Please try again.", isBot: true }
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
        if (regression_result < 0) {
            return `The flight will be ${Math.abs(regression_result).toFixed(2)} minutes early.`;
        } else if (regression_result > 0) {
            return `The flight will be ${regression_result.toFixed(2)} minutes late.`;
        } else {
            return "The flight is on time.";
        }
    };
    return (
        <div className="chatbot-container">
            <div className="chatbot-window">
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.isBot ? "bot" : "user"}`}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                    {results && (
                        <div className="message bot">
                            <p>{formatResults(results)}</p>
                        </div>
                    )}
                </div>

                <div className="chatbot-form">
                    <input
                        type="text"
                        name="userInput"
                        placeholder="Type your response..."
                        onChange={handleInputChange}
                        required
                    />
                    {suggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                            <div className="close-button" onClick={() => setSuggestions([])}>
                                × {/* "X" symbol for close */}
                            </div>
                            {suggestions.map((suggestion, index) => (
                                <p
                                    key={index}
                                    onClick={() => {
                                        handleUserResponse(suggestion); // Handle suggestion click
                                        setSuggestions([]); // Clear suggestions
                                    }}
                                >
                                    {suggestion}
                                </p>
                            ))}
                        </div>
                    )}
                    <button type="submit">Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
