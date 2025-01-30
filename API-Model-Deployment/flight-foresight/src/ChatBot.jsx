
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
        Origin_Airport_Name: "",
        Dest_Airport_Name: "",
        crs_dep_military_date: "",
        crs_arr_military_date: ""
    });

    const steps = [
        { key: "Airline_Name", prompt: "Please provide the Airline Name." },
        { key: "Origin_Airport_Name", prompt: "What is the origin airport code?" },
        { key: "Dest_Airport_Name", prompt: "What is the destination airport code?" },
        { key: "crs_dep_military_date", prompt: "What is the scheduled departure time? (Format: DD/MM/YYYY HH:MM)" },
        { key: "crs_arr_military_date", prompt: "What is the scheduled arrival time? (Format: DD/MM/YYYY HH:MM)" }
    ];


    const [suggestions, setSuggestions] = useState([]);



    const fetchSuggestions = async (input, stepKey) => {
        const endpoint = stepKey === "Airline_Name"
            ? "http://localhost:5001/autocompleteAirline"
            : stepKey === "Origin_Airport_Name"
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
                        console.log("test");

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

        }
        else if (currentKey === "Origin_Airport_Name") {
            try {
                const response1 = await axios.post("http://localhost:5001/verifyOriginAirportName", { Origin_Airport_Name: input });
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
        }
        else if (currentKey === "Dest_Airport_Name") {
            try {
                const response2 = await axios.post("http://localhost:5001/verifyDestAirportName", { Dest_Airport_Name: input });
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

        else if (currentKey === "crs_dep_military_date") {
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
        }

        else if (currentKey === "crs_arr_military_date") {
            try {
                const response4 = await axios.post("http://localhost:5001/verifyArrdate", { crs_arr_military_date: input });
                if (response4.data.valid) {
                    // Proceed to the next step
                    if (currentStep < steps.length - 1) {
                        setCurrentStep((prev) => prev + 1);
                        setMessages((prev) => [...prev, { text: steps[currentStep + 1].prompt, isBot: true }]);
                    }
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
        }


        else {
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

    return (
        <div className="chatbot-container">
            <div className="chatbot-window">
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.isBot ? "bot" : "user"}`}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="chatbot-form">
                    <input
                        type="text"
                        name="userInput"
                        placeholder="Type your response..."
                        onChange={handleInputChange}
                        required
                    />
                    {suggestions.length > 0 && (
                        <ul className="suggestions-dropdown">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        handleUserResponse(suggestion); // Handle suggestion click
                                        setSuggestions([]); // Clear suggestions
                                    }}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button type="submit">Send</button>
                </form>

            </div>
        </div>
    );
};

export default ChatBot;
