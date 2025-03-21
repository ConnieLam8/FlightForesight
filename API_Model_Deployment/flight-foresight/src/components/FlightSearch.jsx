import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlightSearch = () => {
    const [posts, setPosts] = useState([]);

    // // Call the flight api here
    // useEffect(() => {
    //     // Edit this to take in the correct user parameters
    //     axios.get('http://localhost:3000/fetch-flights')
    //         .then(response => {
    //             setPosts(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching flights:', error);
    //         });
    // }, []);

    // Trying another method to fetch the data
    // const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = () => {
        // axios.get('http://localhost:5000/fetch-flights', { params: { query } })
        axios.get('http://localhost:5000/fetch-flights')
            .then(response => {
                setResults(response.data);
                setError(null);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to fetch search results.');
                setResults(null);
            });
    };

    return (
        <div>
            <h1>Fetched Flight Search Results </h1>

            <button onClick={handleSearch}>Search</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {results && (
                <div>
                    <h2>Search Results:</h2>
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            )}

            <ul>
                {posts.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default FlightSearch