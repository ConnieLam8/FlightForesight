import express from 'express';
import mysql from 'mysql2';
const app = express();
import cors from 'cors';
import axios from 'axios';  // Import axios to make HTTP requests
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

app.use(cors());
app.use(express.json());

// Manually define __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
// dotenv.config({path:__dirname+'/./../../.env'});
dotenv.config({path:__dirname+'\\.env'});

// Get the database credentials from the env file
const hostKey = process.env.MYSQL_HOST;
const userKey = process.env.MYSQL_USER;
const passwordKey = process.env.MYSQL_PASSWORD;
const databaseKey = process.env.MYSQL_DATABASE;

// Get the Flight API Key
const flightApiKey = process.env.FLIGHT_API_KEY;

// Get the server URL from the server-ml back-end
const serverUrl = process.env.SERVER_ML_URL;

/////////////////////CONECTION STUFF//////////////////////////
const connection = mysql.createConnection({
    host: hostKey,  // Replace with your RDS instance endpoint
    user: userKey,  // Replace with your DB username
    password: passwordKey,  // Replace with your DB password
    database: databaseKey,  // Replace with your DB name
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

/////////////////// FETCH THE FLIGHTS FROM THE FRONT-END /////////////////////////////////
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


//////////////////// JSON STUFF /////////////////////////////////

function saveToJSON(data) {
    return new Promise((resolve, reject) => {
        // First, ensure that the JSON file exists, and create it if it doesn't
        fs.readFile('airportData.json', 'utf8', (err, fileData) => {
            let jsonData = [];

            if (err) {
                if (err.code === 'ENOENT') {  // File doesn't exist
                    console.log('File not found, creating new one.');
                } else {
                    console.error('Error reading JSON file:', err);
                    return reject(err);
                }
            } else {
                try {
                    // Parse the existing data or initialize an empty array if it's not valid
                    jsonData = JSON.parse(fileData) || [];
                } catch (parseErr) {
                    console.error('Error parsing JSON file:', parseErr);
                    return reject(parseErr);
                }
            }

            // Only store specific fields
            const filteredData = {
                DOT_CODE: data.DOT_Code,
                ORIGIN: data.Origin_Airport_Code,
                DEST: data.Dest_Airport_Code,
                crs_dep_military_time: data.crs_dep_military_date,
                crs_arr_military_time: data.crs_arr_military_date
            };

            // Add the new data to the array
            jsonData.push(filteredData);

            // Ensure the JSON structure is still an array and save it back to the file
            fs.writeFile('airportData.json', JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error('Error saving JSON file:', err);
                    return reject(err);
                } else {
                    console.log('Final data saved to airportData.json');
                    resolve(jsonData); // Resolve the promise with the updated JSON data
                }
            });
        });
    });
}
///////////////////CALL FOR API/////////////////////////

async function sendDataToResultsAPI(data) {
    try {
        // const response = await axios.post('http://127.0.0.1:5000/result', data);
        const response = await axios.post(`${serverUrl}/result`, data);
        console.log('Results API Response:', response.data);
        
        // Clear the JSON file after sending the data
        fs.writeFile('airportData.json', JSON.stringify([], null, 2), (err) => {
            if (err) {
                console.error('Error clearing JSON file:', err);
            } else {
                console.log('JSON file cleared after sending results.');
            }
        });

        return response.data; // Return the results
    } catch (error) {
        console.error('Error sending data to Results API:', error);
        throw error; // Propagate the error
    }
}



////////////////////// VERIFY AIRLINE NAMEE ///////////////////////
app.post('/verifyAirlineName', (req, res) => {
    const { Airline_Name } = req.body;
    console.log('Received airlineName:', Airline_Name);

    const query = 'SELECT DOT_Code FROM Airline WHERE LOWER(Airline_Name) = LOWER(?)';

    connection.execute(query, [Airline_Name], (err, results) => {
        if (err) {
            console.error('Database error:', err);  // Log any database errors
            res.status(500).json({ error: 'Database error' });
        } else {
            console.log('Query results:', results);  // Log query results to debug
            if (results.length > 0) {
                const DOT_Code = results[0].DOT_Code;
                saveToJSON({ Airline_Name, DOT_Code });

                res.json({ valid: true, DOT_Code: results[0].DOT_Code }); // Send the DOT_Code if found
            } else {
                res.json({ valid: false, message: 'Invalid airline name.' });
            }
        }
    });
});

app.post('/autocompleteAirline', (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const sqlQuery = 'SELECT Airline_Name FROM Airline WHERE LOWER(Airline_Name) LIKE LOWER(?) LIMIT 10';
    const searchTerm = `%${query}%`; // Add wildcard for partial matching

    connection.execute(sqlQuery, [searchTerm], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            const suggestions = results.map(row => row.Airline_Name);
            res.json({ suggestions });
        }
    });
});

/////////////////// VERIFY ORIGIN AIRPORT /////////////////////////////////
app.post('/verifyOriginAirportName', (req, res) => {
    const { full_Origin_Airport_Name } = req.body;
    console.log('Received airlineName:', full_Origin_Airport_Name);  // Log the airline name to ensure it's being sent correctly

    if (!full_Origin_Airport_Name) {
        return res.status(400).json({ error: 'Origin Airport Name is required' });
    }

    const query = 'SELECT Origin_Airport_Code FROM Origin_Airport WHERE LOWER(full_Origin_Airport_Name) = LOWER(?)';

    connection.execute(query, [full_Origin_Airport_Name], (err, results) => {
        if (err) {
            console.error('Database error:', err);  // Log any database errors
            res.status(500).json({ error: 'Database error' });
        } else {
            console.log('Query results:', results);  // Log query results to debug
            if (results.length > 0) {
                const Origin_Airport_Code = results[0].Origin_Airport_Code;
                // Save to JSON file
                saveToJSON({ full_Origin_Airport_Name, Origin_Airport_Code });

                res.json({ valid: true, Origin_Airport_Code: results[0].Origin_Airport_Code }); // Send the DOT_Code if found
            } else {
                res.json({ valid: false, message: 'Invalid airport name.' });
            }
        }
    });
});

app.post('/autocompleteOriginAirport', (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const sqlQuery = 'SELECT full_Origin_Airport_Name FROM Origin_Airport WHERE LOWER(full_Origin_Airport_Name) LIKE LOWER(?) LIMIT 10';
    const searchTerm = `%${query}%`;

    connection.execute(sqlQuery, [searchTerm], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            const suggestions = results.map(row => row.full_Origin_Airport_Name);
            res.json({ suggestions });
            // console.error("IM HERE");

        }
    });
});


/////////////////// VERIFY DEST AIRPORT /////////////////////////////////
app.post('/verifyDestAirportName', (req, res) => {
    const { full_Dest_Airport_Name } = req.body;
    console.log('Received airlineName:', full_Dest_Airport_Name);  // Log the airline name to ensure it's being sent correctly

    if (!full_Dest_Airport_Name) {
        return res.status(400).json({ error: 'Origin Airport Name is required' });
    }

    const query = 'SELECT Dest_Airport_Code FROM Dest_Airport WHERE LOWER(full_Dest_Airport_Name) = LOWER(?)';

    connection.execute(query, [full_Dest_Airport_Name], (err, results) => {
        if (err) {
            console.error('Database error:', err);  // Log any database errors
            res.status(500).json({ error: 'Database error' });
        } else {
            console.log('Query results:', results);  // Log query results to debug
            if (results.length > 0) {
                const Dest_Airport_Code = results[0].Dest_Airport_Code;
                // Save to JSON file
                saveToJSON({ full_Dest_Airport_Name, Dest_Airport_Code });

                res.json({ valid: true, Dest_Airport_Code: results[0].Dest_Airport_Code }); // Send the DOT_Code if found
            } else {
                res.json({ valid: false, message: 'Invalid airport name.' });
            }
        }
    });
});

app.post('/autocompleteDestAirport', (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const sqlQuery = 'SELECT full_Dest_Airport_Name FROM Dest_Airport WHERE LOWER(full_Dest_Airport_Name) LIKE LOWER(?) LIMIT 10';
    const searchTerm = `%${query}%`;

    connection.execute(sqlQuery, [searchTerm], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            const suggestions = results.map(row => row.full_Dest_Airport_Name);
            res.json({ suggestions });
            // console.error("IM HERE");

        }
    });
});

/////////////////// VERIFY DEPARTURE DATE /////////////////////////////////
app.post('/verifydepartureDate', async (req, res) => {
    const { departureDate } = req.body;
    console.log('Received departure date:', departureDate);

    // Check if departureDate is provided
    if (!departureDate) {
        return res.status(400).json({ error: 'Departure date is required' });
    }

    // Validate MM-DD-YYYY format using regex
    const dateFormatRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!dateFormatRegex.test(departureDate)) {
        return res.status(400).json({ error: 'Invalid format. Please use MM-DD-YYYY.' });
    }
    // Convert MM-DD-YYYY to Date object (JS uses YYYY-MM-DD)
    const [month, day, year] = departureDate.split('/').map(Number);
    const inputDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison

    // Validate if the input date is in the past
    if (inputDate < today) {
        return res.status(400).json({ error: 'Invalid departure date. The date must be today or in the future.' });
    }

    res.status(200).json({ valid: true, message: 'Departure date is valid' });
});


/////////////////// VERIFY DEPARTURE DATE /////////////////////////////////
app.post('/verifyDepdate', (req, res) => {
    const { crs_dep_military_date } = req.body;
    console.log('Received dep date:', crs_dep_military_date);  // Log the airline name to ensure it's being sent correctly
    // Check if the crs_dep_military_date is provided
    if (!crs_dep_military_date) {
        return res.status(400).json({ error: 'Departure date is required' });
    }

    // Regex to validate HH:MM format (24-hour time)
    const timeFormatRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

    // Validate if crs_dep_military_date matches the HH:MM format
    if (!timeFormatRegex.test(crs_dep_military_date)) {
        return res.status(400).json({ error: 'Invalid time format. Please use HH:MM format.' });
    }

    saveToJSON({crs_dep_military_date});

    res.status(200).json({ valid: true, message: 'Departure time validated successfully' });


});

/////////////////// VERIFY ARRIVAL DATE /////////////////////////////////
app.post('/verifyArrdate', async (req, res) => {
    const { crs_arr_military_date } = req.body;
    console.log('Received arr date:', crs_arr_military_date);

    // Check if the crs_arr_military_date is provided
    if (!crs_arr_military_date) {
        return res.status(400).json({ error: 'Arrival date is required' });
    }

    // Regex to validate HH:MM format (24-hour time)
    const timeFormatRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

    // Validate if crs_arr_military_date matches the HH:MM format
    if (!timeFormatRegex.test(crs_arr_military_date)) {
        return res.status(400).json({ error: 'Invalid time format. Please use HH:MM format.' });
    }

    try {
        // Save the arrival date to the JSON file
        const jsonData = await saveToJSON({ crs_arr_military_date });

        // After saving, send the data to the Results API
        const results = await sendDataToResultsAPI(jsonData);

        // Send the results back to the frontend
        res.status(200).json({ valid: true, message: 'Arrival time validated successfully', results });
    } catch (error) {
        console.error('Error processing arrival date:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const port = 5001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});