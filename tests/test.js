// //This starts the app up
import {server} from '../app'

//Set up axios a little bit
import axios from 'axios'
const url = `http://localhost:4000`
const request = axios.create({ baseURL: url })

//Grab the db variable
import db from '../src/db/db'

//Before each test we are going to rollback and
//migrate out database to its latest version
beforeEach(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
    // await knex.seed.run()
});

//After all the tests are done we're going to close our server
//and rollback our database.
afterAll(async () => {
    await db.migrate.rollback()
    return server.close()
});

it('returns homepage', async () => {
    expect.assertions(1)
    const response = await request.get('/')
    expect(response.status).toBe(200)
});

// const userSignup = require('./controllers/userActionController')
// it('signs up a user', async () => {
//     expect.assertions(1)

//     const userActionController = new UserActionController();
//     await userActionController.signup({});

//   // const response = await request.get('/')
//   // expect(response.status).toBe(200)
// });
