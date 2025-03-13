import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;      // Switch to the correct port of the site

// Manually define __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
// dotenv.config();
dotenv.config({path:__dirname+'/./../../.env'});

// Set the app headers below to prevent network errors
app.use(cors());
app.use(express.json());

const flightApiKey = process.env.FLIGHT_API_KEY;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

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

// Listen on the correct port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
