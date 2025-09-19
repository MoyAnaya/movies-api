const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Middleware de validación
const validateMovie = (req, res, next) => {
    const { titulo, genero, anoLanzamiento } = req.body;
    
    if (!titulo || !genero || !anoLanzamiento) {
        return res.status(400).json({
            error: 'Los campos titulo, genero y anoLanzamiento son obligatorios'
        });
    }
    
    if (typeof anoLanzamiento !== 'number' || anoLanzamiento < 1900 || anoLanzamiento > new Date().getFullYear() + 5) {
        return res.status(400).json({
            error: 'El año de lanzamiento debe ser un número válido'
        });
    }
    
    next();
};

// GET /api/movies - Obtener todas las películas
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.getAll();
        res.json(movies);
    } catch (error) {
        console.error('Error en GET /movies:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/movies/search?q=query - Buscar películas
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
        }
        
        const movies = await Movie.search(q);
        res.json(movies);
    } catch (error) {
        console.error('Error en GET /movies/search:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/movies/:id - Obtener una película por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID debe ser un número' });
        }
        
        const movie = await Movie.getById(parseInt(id));
        
        if (!movie) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        
        res.json(movie);
    } catch (error) {
        console.error('Error en GET /movies/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/movies - Crear una nueva película
router.post('/', validateMovie, async (req, res) => {
    try {
        const movieData = {
            titulo: req.body.titulo.trim(),
            genero: req.body.genero.trim(),
            anoLanzamiento: parseInt(req.body.anoLanzamiento),
            urlImagen: req.body.urlImagen ? req.body.urlImagen.trim() : null
        };
        
        const newMovie = await Movie.create(movieData);
        res.status(201).json(newMovie);
    } catch (error) {
        console.error('Error en POST /movies:', error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/movies/:id - Actualizar una película
router.put('/:id', validateMovie, async (req, res) => {
    try {
        const { id } = req.params;
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID debe ser un número' });
        }
        
        const movieData = {
            titulo: req.body.titulo.trim(),
            genero: req.body.genero.trim(),
            anoLanzamiento: parseInt(req.body.anoLanzamiento),
            urlImagen: req.body.urlImagen ? req.body.urlImagen.trim() : null
        };
        
        const updatedMovie = await Movie.update(parseInt(id), movieData);
        res.json(updatedMovie);
    } catch (error) {
        console.error('Error en PUT /movies/:id:', error);
        
        if (error.message.includes('no encontrada')) {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/movies/:id - Eliminar una película
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID debe ser un número' });
        }
        
        await Movie.delete(parseInt(id));
        res.status(204).send();
    } catch (error) {
        console.error('Error en DELETE /movies/:id:', error);
        
        if (error.message.includes('no encontrada')) {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;