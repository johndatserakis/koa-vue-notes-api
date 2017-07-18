import Koa from 'koa';
import router from './router';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import mysql from 'mysql2';

//For .env file
require('dotenv').config();

const app = new Koa()

//Set up global mysql handler
const config = {
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};
global.connectionPool = mysql.createPool(config);

//For cors
app.use(cors())

//For managing body
app.use(bodyParser())

//For router
app.use(router.routes())
app.use(router.allowedMethods());

//Birds-eye processing
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        throw error;
    }
})

export default app;