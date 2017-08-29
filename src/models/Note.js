import db from '../db/db'
import rand from 'randexp'

class Note {
    constructor(data) {
        if (!data) {
            return
        }

        this.id = data.id
        this.userId = data.userId
        this.title = data.title
        this.content = data.content
        this.ipAddress = data.ipAddress
    }

    async all(request) {
        try {
            return await db('notes')
                .select('*')
                .where({ userId: request.userId })
                .where(
                    'title',
                    'like',
                    '%' + (request.sort ? request.sort : '') + '%'
                )
                .orderBy('createdAt', request.order)
                .offset(+request.page * +request.limit)
                .limit(+request.limit)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async find(id) {
        try {
            let result = await findById(id)
            if (!result) return {}
            this.constructor(result)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async store() {
        try {
            return await db('notes').insert(this)
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async save(request) {
        try {
            return await db('notes')
                .update(this)
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }

    async destroy(request) {
        try {
            return await db('notes')
                .delete()
                .where({ id: this.id })
        } catch (error) {
            console.log(error)
            throw new Error('ERROR')
        }
    }
}

async function findById(id) {
    try {
        let [noteData] = await db('notes')
            .select('id', 'userId', 'title', 'content')
            .where({ id: id })
        return noteData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { Note, findById }
