//Only run tests if we've specifically set NODE_ENV to testing
if (process.env.NODE_ENV !== 'testing') {
    throw new Error('NODE_ENV not set')
}

//This starts the app up
import { server } from '../app'

//Set up axios a little bit
import axios from 'axios'
const url = `http://localhost:4000`
const request = axios.create({ baseURL: url })

//Grab the db variable
import db from '../src/db/db'

beforeAll(async () => {
    //As the tests start rollback and migrate our tables
    await db.migrate.rollback()
    await db.migrate.latest()
})

afterAll(async () => {
    //After all the tests are done we're going to close our server
    //and rollback our database.
    await db.migrate.rollback()

    //This closes the app but it doesn't stop the tests in
    //Jest when done - that's why we have to --forceExit
    //when running Jest for now.
    return server.close()
})

/////////////
// General //
/////////////

//Variables for testing that get populated from different calls
let accessToken
let refreshToken
let passwordResetToken

describe('general actions', () => {
    it('returns homepage', async () => {
        expect.assertions(1)
        const response = await request.get('/')
        expect(response.status).toBe(200)
    })
})

//////////
// User //
//////////

describe('user account actions', () => {
    it('signs up a user', async () => {
        expect.assertions(1)

        const response = await request.post('/api/v1/user/signup', {
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            username: 'TestUsername',
            email: 'TestEmail@example.com',
            password: 'TestPassword',
        })
        expect(response.status).toBe(200)
    })

    it('authenticates a user', async () => {
        expect.assertions(3)

        const response = await request.post('/api/v1/user/authenticate', {
            username: 'TestUsername',
            password: 'TestPassword',
        })

        expect(response.status).toBe(200)
        expect(response.data.accessToken).toBeDefined()
        expect(response.data.refreshToken).toBeDefined()

        //Let's store the returned access and refresh tokens for the
        //upcoming tests. Also we'll set the Auth on the axios
        //instance for testing.
        accessToken = response.data.accessToken
        refreshToken = response.data.refreshToken
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
    })

    it("refresh user's accessToken", async () => {
        expect.assertions(3)

        const response = await request.post('/api/v1/user/refreshAccessToken', {
            username: 'TestUsername',
            refreshToken: refreshToken,
        })
        expect(response.status).toBe(200)
        expect(response.data.accessToken).toBeDefined()
        expect(response.data.refreshToken).toBeDefined()
    })

    it("invalidate all the user's refreshTokens", async () => {
        expect.assertions(1)

        const response = await request.post(
            '/api/v1/user/invalidateAllRefreshTokens',
            {
                username: 'TestUsername',
            }
        )
        expect(response.status).toBe(200)
    })

    it('invalidate specific refreshToken', async () => {
        expect.assertions(1)

        const response = await request.post(
            '/api/v1/user/invalidateRefreshToken',
            {
                refreshToken: refreshToken,
            }
        )
        expect(response.status).toBe(200)
    })

    it("forgot user's password", async () => {
        expect.assertions(2)

        const response = await request.post('/api/v1/user/forgot', {
            email: 'TestEmail@example.com',
            url: 'http://koa-vue-notes-api.com/user/reset',
            type: 'web',
        })
        expect(response.status).toBe(200)
        expect(response.data.passwordResetToken).toBeDefined()

        //Store password reset token
        passwordResetToken = response.data.passwordResetToken
    })

    it('checks password reset token', async () => {
        expect.assertions(1)

        const response = await request.post(
            '/api/v1/user/checkPasswordResetToken',
            {
                passwordResetToken: passwordResetToken,
                email: 'TestEmail@example.com',
            }
        )
        expect(response.status).toBe(200)
    })

    it("reset user's password", async () => {
        expect.assertions(1)

        const response = await request.post('/api/v1/user/resetPassword', {
            email: 'TestEmail@example.com',
            passwordResetToken: passwordResetToken,
            password: 'TestPassword',
        })
        expect(response.status).toBe(200)
    })

    it('return data from a authenticated route', async () => {
        expect.assertions(1)

        const response = await request.post('/api/v1/user/private', {})
        expect(response.status).toBe(200)
    })
})

///////////
// Notes //
///////////

describe('note actions', () => {
    it('creates a note', async () => {
        expect.assertions(1)

        const response = await request.post('/api/v1/notes', {
            title: 'Here is my first note',
            content: 'Here is my main content.',
        })
        expect(response.status).toBe(200)
    })

    it('shows a note', async () => {
        expect.assertions(4)

        const response = await request.get('/api/v1/notes/' + '1')
        expect(response.status).toBe(200)
        expect(response.data.id).toBe(1)
        expect(response.data.title).toBe('Here is my first note')
        expect(response.data.content).toBe('Here is my main content.')
    })

    it("gets a bunch of a user's notes", async () => {
        expect.assertions(4)

        const response = await request.get('/api/v1/notes/', {
            params: { sort: '', order: 'desc', page: 0, limit: 20 },
        })
        expect(response.status).toBe(200)
        expect(response.data[0].id).toBe(1)
        expect(response.data[0].title).toBe('Here is my first note')
        expect(response.data[0].content).toBe('Here is my main content.')
    })

    it('updates a note', async () => {
        expect.assertions(1)

        const response = await request.put('/api/v1/notes/' + '1', {
            title: 'Here is my first note',
            content: 'Here is my main content.',
        })
        expect(response.status).toBe(200)
    })

    it('deletes a note', async () => {
        expect.assertions(1)

        const response = await request.delete('/api/v1/notes/' + '1')
        expect(response.status).toBe(200)
    })
})
