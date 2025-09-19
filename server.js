const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const movieRoutes = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging simple
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Rutas
app.use('/api/movies', movieRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: '🎬 API de Películas funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            'GET /api/movies': 'Obtener todas las películas',
            'GET /api/movies/:id': 'Obtener película por ID',
            'POST /api/movies': 'Crear nueva película',
            'PUT /api/movies/:id': 'Actualizar película',
            'DELETE /api/movies/:id': 'Eliminar película'
        }
    });
});

// Health check
app.get('/health', async (req, res) => {
    try {
        const dbStatus = await testConnection();
        res.json({
            status: 'OK',
            database: dbStatus ? 'Connected' : 'Disconnected'
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            error: error.message
        });
    }
});

// Iniciar servidor
async function startServer() {
    try {
        console.log('🔍 Probando conexión a MySQL...');
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ No se pudo conectar a MySQL');
            console.log('💡 Verifica:');
            console.log('   - Que MySQL esté ejecutándose');
            console.log('   - La contraseña en el archivo .env');
            console.log('   - Que la base de datos movies_db exista');
            return;
        }
        
        app.listen(PORT, () => {
            console.log('🚀 Servidor iniciado exitosamente');
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log('-------------------------------------------');
        });
        
    } catch (error) {
        console.error('❌ Error al iniciar:', error.message);
    }
}

startServer();