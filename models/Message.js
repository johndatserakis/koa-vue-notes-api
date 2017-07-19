import pool from '../src/db';

class Message {
    constructor() {}

    async getAllMessages() {
        try {
            let messages = await pool.query('select * from test_table');
            return messages;
        } catch (err) {
            throw new Error('Internal Server Error');
        }
    }
}

module.exports = Message;