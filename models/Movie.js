const { pool } = require('../config/database');

class Movie {
    constructor(id, titulo, genero, anoLanzamiento, urlImagen) {
        this.id = id;
        this.titulo = titulo;
        this.genero = genero;
        this.anoLanzamiento = anoLanzamiento;
        this.urlImagen = urlImagen;
    }

    // Obtener todas las películas
    static async getAll() {
        try {
            const [rows] = await pool.execute(
                'SELECT id, titulo, genero, ano_lanzamiento as anoLanzamiento, url_imagen as urlImagen FROM movies ORDER BY id DESC'
            );
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener películas: ${error.message}`);
        }
    }

    // Obtener una película por ID
    static async getById(id) {
        try {
            const [rows] = await pool.execute(
                'SELECT id, titulo, genero, ano_lanzamiento as anoLanzamiento, url_imagen as urlImagen FROM movies WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener película: ${error.message}`);
        }
    }

    // Crear una nueva película
    static async create(movieData) {
        try {
            const { titulo, genero, anoLanzamiento, urlImagen } = movieData;
            
            const [result] = await pool.execute(
                'INSERT INTO movies (titulo, genero, ano_lanzamiento, url_imagen) VALUES (?, ?, ?, ?)',
                [titulo, genero, anoLanzamiento, urlImagen || null]
            );

            const newMovie = await this.getById(result.insertId);
            return newMovie;
        } catch (error) {
            throw new Error(`Error al crear película: ${error.message}`);
        }
    }

    // Actualizar una película
    static async update(id, movieData) {
        try {
            const { titulo, genero, anoLanzamiento, urlImagen } = movieData;
            
            const [result] = await pool.execute(
                'UPDATE movies SET titulo = ?, genero = ?, ano_lanzamiento = ?, url_imagen = ? WHERE id = ?',
                [titulo, genero, anoLanzamiento, urlImagen || null, id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Película no encontrada');
            }

            const updatedMovie = await this.getById(id);
            return updatedMovie;
        } catch (error) {
            throw new Error(`Error al actualizar película: ${error.message}`);
        }
    }

    // Eliminar una película
    static async delete(id) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM movies WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Película no encontrada');
            }

            return true;
        } catch (error) {
            throw new Error(`Error al eliminar película: ${error.message}`);
        }
    }

    // Buscar películas por título o género
    static async search(query) {
        try {
            const [rows] = await pool.execute(
                'SELECT id, titulo, genero, ano_lanzamiento as anoLanzamiento, url_imagen as urlImagen FROM movies WHERE titulo LIKE ? OR genero LIKE ? ORDER BY id DESC',
                [`%${query}%`, `%${query}%`]
            );
            return rows;
        } catch (error) {
            throw new Error(`Error al buscar películas: ${error.message}`);
        }
    }
}

module.exports = Movie;