import {} from 'dotenv/config';
import pool from '../db';
import joi from 'joi';

class Note {
    constructor(data) {
        if (!data) return;

        this.data = {
            id: data.id,
            userId: data.userId,
            title: data.title,
            content: data.content,
            ipAddress: data.ipAddress,
        };
    }

    async save() {
        try {
            await pool.query(`INSERT INTO koa_vue_notes_notes SET ?`, [
                this.data,
            ]);
        } catch (error) {
            ctx.throw(400, error);
        }
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
