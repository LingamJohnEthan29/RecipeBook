const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3000;
const uri = "mongodb+srv://medhanaidubonu:fxJZ3r4sFt5krCFY@recipes.9ye98.mongodb.net/?retryWrites=true&w=majority&appName=Recipes";

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));

const upload = multer({ dest: 'uploads/' });

let db;

// Connect to MongoDB
MongoClient.connect(uri)
    .then(client => {
        db = client.db('recipeBook');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error('Database connection error:', error);
        process.exit(1); // Exit the process if database connection fails
    });

// Get all recipes or search by name
app.get('/recipes', async (req, res) => {
    res.set('Cache-Control', 'no-store'); // Prevent caching
    const searchQuery = req.query.search ? req.query.search.trim() : '';

    try {
        const filter = searchQuery
            ? { name: { $regex: new RegExp(searchQuery, 'i') } } // Case-insensitive search
            : {}; // If no search query, return all recipes

        const recipes = await db.collection('recipes').find(filter).toArray();
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send('Failed to fetch recipes.');
    }
});

// Get a specific recipe by ID
app.get('/recipes/:id', async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(recipeId) });
        
        if (!recipe) {
            console.warn(`Recipe not found: ID ${recipeId}`);
            return res.status(404).send('Recipe not found');
        }
        
        res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        if (error instanceof ObjectId) {
            return res.status(400).send('Invalid recipe ID format.');
        }
        res.status(500).send('Failed to fetch recipe.');
    }
});

// Create a new recipe
app.post('/recipes', upload.single('mainImage'), async (req, res) => {
    try {
        const newRecipe = {
            name: req.body.name,
            mainImage: req.file ? req.file.filename : null,
            ingredients: req.body.ingredients,
            preparationLevel: req.body.preparationLevel,
            steps: req.body.steps,
            description: req.body.description,
        };
        const result = await db.collection('recipes').insertOne(newRecipe);
        res.status(201).json({ id: result.insertedId, ...newRecipe });
    } catch (error) {
        console.error('Error creating new recipe:', error);
        res.status(500).send('Failed to create recipe.');
    }
});
