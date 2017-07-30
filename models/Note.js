import {} from 'dotenv/config';
import pool from '../src/db';
import joi from 'joi';

const noteIndexSchema = joi.object({
    firstName: joi.string().min(1).max(25).alphanum().required(),
    lastName: joi.string().min(1).max(25).alphanum().required(),
    username: joi.string().min(3).max(100).regex(/[a-zA-Z0-9@]/).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(35).required(),
});

class Note {
    constructor() {}

    async index(ctx) {}
}

module.exports = Note;
