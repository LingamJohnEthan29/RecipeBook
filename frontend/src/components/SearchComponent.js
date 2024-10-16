import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchComponent = ({ onResults, onNewSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = async () => {
        await searchRecipes(searchTerm);
        if (searchTerm) {
            onNewSearch(searchTerm); // Update previous searches
        }
    };

    const searchRecipes = async (query) => {
        if (!query) {
            onResults([]); // Clear results if search term is empty
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/recipes?search=${query}`);
            if (response.ok) {
                const data = await response.json();
                onResults(data); // Pass results back to parent
            } else {
                console.error('Failed to fetch recipes:', response.statusText);
                onResults([]); // Clear results on error
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            onResults([]); // Clear results on error
        }
    };

    return (
        <div className="search-box">
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="SEARCH FOR RECIPE"
            />
            <button className="btn" onClick={handleSearchSubmit}>
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </div>
    );
};

export default SearchComponent;
