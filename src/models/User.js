import db from '../db/db'

class User {
    constructor(data) {
        if (!data) {
            return
        }

        this.id = data.id
        this.token = data.token
        this.username = data.username
        this.email = data.email
        this.isAdmin = data.isAdmin
    }
}

async function findById(id) {
    try {
        const [userData] = db('users')
            .select('id', 'token', 'username', 'email', 'isAdmin')
            .where({ id: id })
        return userData
    } catch (error) {
        console.log(error)
        throw new Error('ERROR')
    }
}

export { User, findById }
