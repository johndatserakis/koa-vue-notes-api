import {} from 'dotenv/config';
import pool from '../db/db';
import rand from 'randexp';

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

    async all(input) {
        try {
            return await pool.query(
                `
                SELECT *
                FROM koa_vue_notes_notes
                WHERE userId = ?
                AND title LIKE CONCAT('%', ?, '%')
                ORDER BY createdAt ` +
                    input.order +
                    `
                LIMIT ?, ?
                `,
                [
                    input.userId,
                    input.sort ? input.sort : '',
                    +input.page * +input.limit,
                    +input.limit,
                ]
            );
        } catch (error) {
            console.log(error);
            throw new Error('ERROR');
        }
    }

    async find(input) {
        try {
            let result = await findById(input.id);
            if (!result) return {};
            this.constructor(result);
        } catch (error) {
            console.log(error);
            throw new Error('ERROR');
        }
    }

    async store() {
        try {
            return await pool.query(`INSERT INTO koa_vue_notes_notes SET ?`, [
                this,
            ]);
        } catch (error) {
            console.log(error);
            throw new Error('ERROR');
        }
    }

    async save(input) {
        try {
            await pool.query(`UPDATE koa_vue_notes_notes SET ? WHERE id = ?`, [
                this,
                this.id,
            ]);
        } catch (error) {
            console.log(error);
            throw new Error('ERROR');
        }
    }

    async destroy(input) {
        try {
            await pool.query(`DELETE FROM koa_vue_notes_notes WHERE id = ?`, [
                this.id,
            ]);
        } catch (error) {
            console.log(error);
            throw new Error('ERROR');
        }
    }
}

async function findById(id) {
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
        console.log(error);
        throw new Error('ERROR');
    }
}

export { Note, findById };
