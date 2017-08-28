const knex = require('knex')

const config = {
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
}

//Here we check to see if we are in testing mode. If we are,
//we set the database name to one with a '_tests' at the end,
//which we'll build and tear-down for each test.
if (process.env.NODE_ENV === 'testing') {
    config.connection.database = process.env.DB_DATABASE + '_tests'
}

const db = knex(config)
export default db
