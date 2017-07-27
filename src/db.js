import mysql from 'promise-mysql';

import {} from 'dotenv/config';

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 100,
};

const pool = mysql.createPool(config);

export default pool;
