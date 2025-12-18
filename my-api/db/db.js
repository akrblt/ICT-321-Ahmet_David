import mysql from 'mysql2/promise';

// MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',       // Your MySQL username
    password: 'root',       // Your MySQL password
    database: 'pizzaapp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;