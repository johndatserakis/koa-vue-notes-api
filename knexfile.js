//This knexfile is just used for migrations. The actual
//db object is built in ./src/db/db and is used throughout the app.

require('dotenv').config();

module.exports = {

    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
    migrations: {
        directory: './src/db/migrations',
    },
    seeds: {
        directory: './src/db/seeds/dev',
    },

};