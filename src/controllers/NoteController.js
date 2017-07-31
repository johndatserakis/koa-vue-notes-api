import {} from 'dotenv/config';
import pool from '../db';
import joi from 'joi';

import { User, findById as findUserById } from '../models/User';
import { Note, findById as findNoteById } from '../models/Note';

const noteSchema = joi.object({
    id: joi.number().integer(),
    userId: joi.number().integer().required(),
    title: joi.string().required(),
    content: joi.string().required(),
    ipAddress: joi.string(),
});

class NoteController {
    async index(ctx) {
        const user = new User(ctx.state.user[0]);
        let notes;

        try {
            notes = await pool.query(
                `
                SELECT *
                FROM koa_vue_notes_notes
                WHERE userId = ?
                ORDER BY ?
                LIMIT ?, ?
                `,
                [
                    user.id,
                    ctx.query.order,
                    +ctx.query.page * +ctx.query.limit,
                    +ctx.query.limit,
                ]
            );
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA');
        }

        ctx.body = notes;
    }

    async show(ctx) {
        if (!ctx.params.id) ctx.throw(400, 'INVALID_DATA');
        const note = new Note(await findNoteById(ctx.params.id, ctx));
        ctx.body = note;
    }

    async create(ctx) {
        //Attach logged in user
        const user = new User(ctx.state.user[0]);
        ctx.request.body.userId = user.data.id;

        //Add ip
        ctx.request.body.ipAddress = ctx.ip;

        //Create a new note object
        const note = new Note(ctx.request.body);

        // //Validate the newly created note
        const validator = joi.validate(note.data, noteSchema);
        if (validator.error) ctx.throw(400, validator.error.details[0].message);

        //Actually create the note
        note.save();

        //Respond back with success
        ctx.body = { message: 'SUCCESS' };
    }
}

export default NoteController;
