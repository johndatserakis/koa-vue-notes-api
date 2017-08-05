import {} from 'dotenv/config';
import pool from '../db/db';

class Note {
    constructor(data) {
        if (!data) {
            return;
        }

        this.id = data.id;
        this.userId = data.userId;
        this.title = data.title;
        this.content = data.content;
        this.ipAddress = data.ipAddress;
    }
}

async function findById(id, ctx) {
    try {
        let noteData = await pool.query(
            `
            SELECT id, userId, title, content
            FROM koa_vue_notes_notes
            WHERE id = ?
            `,
            [id]
        );
        return noteData[0];
    } catch (error) {
        ctx.throw(500, 'SERVER_ERROR');
    }
}

export { Note, findById };
