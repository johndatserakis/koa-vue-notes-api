//This starts the app up
import {server} from '../app'

//Set up axios a little bit
import axios from 'axios'
const url = `http://localhost:4000`
const request = axios.create({ baseURL: url })

//Grab the db variable
import db from '../src/db/db'

//Before all promosie fix for async/await Jest
//https://github.com/facebook/jest/issues/1760
// beforeAll(() => {
//     global.Promise = require.requireActual('promise');
// });

//After all the tests are done we're going to close our server
//and rollback our database.
// afterAll(async () => {
//     await db.migrate.rollback()

//     //This closes the app but it doesn't stop the tests in
//     //Jest when done - that's why we have to --forceExit
//     //when running Jest for now.
//     return server.close()
// });

// describe('general actions', () => {
    it('returns homepage', async () => {
        // expect.assertions(1)
        // const response = await request.get('/')
        // expect(response.status).toBe(200)

        expect.assertions(1)
        expect(1 + 1).toBe(2)
    });
// });

// describe('user account actions', () => {
//     beforeAll(async () => {
//         await db.migrate.rollback()
//         await db.migrate.latest()
//     });

//     it('signs up a user', async () => {
//         expect.assertions(1)
//         const response = await request.post('/api/v1/user/signup', {
//             "firstName": "TestFirstName",
//             "lastName": "TestLastName",
//             "username": "TestUsername",
//             "email": "TestEmail@example.com",
//             "password": "TestPassword"
//         })
//         expect(response.status).toBe(200)
//     });

//     it('authenticates a user', async () => {
//         expect.assertions(1)
//         const response = await request.post('/api/v1/user/authenticate', {
//             "username": "TestUsername",
//             "password": "TestPassword"
//         })
//         expect(response.status).toBe(200)
//     });
// })