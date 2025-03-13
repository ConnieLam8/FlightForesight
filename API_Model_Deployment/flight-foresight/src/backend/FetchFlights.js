const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;      // Switch to the correct port of the site

const cors = require('cors');

require('dotenv').config({path:__dirname+'/./../../.env'});

// Set the app headers below to prevent network errors
app.use(cors());
app.use(express.json());

const flightApiKey = process.env.FLIGHT_API_KEY;

// console.log("Loaded Environment Variables:", process.env);
console.log("API Key: ", flightApiKey);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// // Serve the react app for any other route
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.get('/fetch-flights', async (req, res) => {
    console.log('Received query params: ', req.query);
    const { departure_id, arrival_id, outbound_date, return_date, currency } = req.query;

    console.log('HERE IS the query from the backend')
    console.log({ arrival_id, departure_id, outbound_date, return_date, currency })

    if (!arrival_id || !departure_id) {
        return res.status(400).json({ error: 'arrival_id and departure_id are required' });
    }

    try {
        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                // q: query,
                engine: "google_flights",
                departure_id,
                arrival_id,
                outbound_date,
                return_date,
                currency,
                hl: "en",
                output: "JSON",
                api_key: flightApiKey,
            },
        });
        // res.json(response.data);
        // Ensure headers haven't been sent before sending the response
        if (!res.headersSent) {
            res.json(response.data);  // Send response data to the front-end
        }

        // Save data to a JSON file for displaying to the front-end
        console.log("Current Directory: ", __dirname);

        const filePath = path.join(__dirname, 'flightResults.json');
        console.log("Current Path: ", filePath);
        fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));

    } catch (error) {
        // Check if response was already sent before sending another one
        if (!res.headersSent) {
            res.status(500).json({ error: "Headers Error fetching from SerpAPI", details: err.message });
        }

        console.error('Error fetching from SerpAPI:', error);
        res.status(500).json({ error: 'Failed to fetch data from SerpAPI' });
    }
});

// // Testing a post endpoint to fetch the flight data
// app.post('/fetch-flights', async(req, res) => {
//     axios.get('https://serpapi.com/search.json?engine=google_flights&departure_id=PEK&arrival_id=AUS&outbound_date=2025-01-29&return_date=2025-02-04&currency=USD&hl=en&api_key=b01f838c7be3bde824c55fcb47ecb255f500ca4f7b800ca1a780d29d41041457')
//         .then(function(response) {
//             res.send(response.data);
//         })
//         .catch(function(error) {
//             res.send(error.response.data);
//         })
// });

// // Endpoint to fetch the flight data
// app.get('/fetch-flights', async(req, res) => {
//     try {
//         res.json({ flights: [] }); // Example response

//         const response = await axios.get('https://serpapi.com/search.json?engine=google_flights&departure_id=PEK&arrival_id=AUS&outbound_date=2025-01-29&return_date=2025-02-04&currency=USD&hl=en&api_key=b01f838c7be3bde824c55fcb47ecb255f500ca4f7b800ca1a780d29d41041457');
//         const flightData = response.data;

//         // Save data to a JSON file for displaying
//         const filePath = path.join(__dirname, 'flightResults.json');
//         fs.writeFileSync(filePath, JSON.stringify(flightData, null, 2));

//         res.json(flightData);
//     } catch (error) {
//         console.error('Error fetching the flights:', error);
//         res.status(500).send('Failed to fetch the flight data. ');
//     }
// });

// Listen on the correct port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
