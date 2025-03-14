
const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const axios = require('axios');  // Import axios to make HTTP requests
const path = require('path');

app.use(cors());
app.use(express.json());
const fs = require('fs');

// Load environment variables
require('dotenv').config({path:__dirname+'/./../../.env'});

// Get the database credentials from the env file
const hostKey = process.env.MYSQL_HOST;
const userKey = process.env.MYSQL_USER;
const passwordKey = process.env.MYSQL_PASSWORD;
const databaseKey = process.env.MYSQL_DATABASE;

/////////////////////COONECTION STUFF//////////////////////////
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




/////////////JsON STUFF /////////////////////////////////

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
        const response = await axios.post('http://127.0.0.1:5000/result', data);
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
