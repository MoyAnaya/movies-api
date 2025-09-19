const mysql = require('mysql2/promise');
require ('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'gohan31ene',
    database: process.env.DB_NAME || 'movies_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

async function testConnection() {
    try{
        const connection = await pool.getConnection();
        console.log('Conexion exitosa a MySQL :)');
        connection.release();
        return true;
    } catch (error){
        console.log('Error al contectar con MySQL :(', error.message);
        return false;
    }
}

module.exports = {
    pool,
    testConnection
}