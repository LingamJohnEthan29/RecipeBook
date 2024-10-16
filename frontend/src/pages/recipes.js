import React, { useEffect, useState } from 'react';
import PreviousSearches from "../components/PreviousSearches";
import RecipeCard from "../components/RecipeCard";
import CreateRecipe from '../components/CreateRecipe'; 
import SearchComponent from '../components/SearchComponent'; 

export default function Recipes() {
    const [recipes, setRecipes] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [searchResults, setSearchResults] = useState([]); 
    const [previousSearches, setPreviousSearches] = useState([]); 
    const [hasSearched, setHasSearched] = useState(false); 

    const fetchRecipes = async () => {
        setLoading(true); 
        try {
            const response = await fetch('http://localhost:3000/recipes'); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRecipes(data); 
            setError(null); 
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Failed to load recipes.'); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchRecipes(); 
    }, []);

    const handleSearchResults = (results) => {
        setSearchResults(results); 
        setHasSearched(true); 
    };

    const updatePreviousSearches = (newSearch) => {
        setPreviousSearches((prev) => {
            if (!prev.includes(newSearch)) {
                return [newSearch, ...prev]; 
            }
            return prev; 
        });
    };

    return (
        <div>
            <div className="recipes-tab">
                <CreateRecipe />
            </div>
            <div className="search-section">
                <PreviousSearches 
                    searches={previousSearches} 
                    onSearchClick={handleSearchResults} 
                />
                <SearchComponent onResults={handleSearchResults} onNewSearch={updatePreviousSearches} />
            </div>
            <div className="recipes-container">
                {loading ? (
                    <p>Loading recipes...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        {searchResults.length > 0 ? (
                            <>
                                <h2>Search Results:</h2>
                                {searchResults.map((recipe) => (
                                    <RecipeCard key={recipe._id} recipe={recipe} />
                                ))}
                            </>
                        ) : (
                            <>
                                {recipes.length > 0 ? (
                                    recipes.map((recipe) => (
                                        <RecipeCard key={recipe._id} recipe={recipe} />
                                    ))
                                ) : (
                                    <p>No recipes found.</p>
                                )}
                                {hasSearched && searchResults.length === 0 && (
                                    <>
                                        <h2>Search Results:</h2>
                                        <p>No recipes found for that search.</p>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
