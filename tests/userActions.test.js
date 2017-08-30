import {server} from '../app'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter';
const mock = new MockAdapter(axios);

import UserActionController from '../src/controllers/UserActionController'

//After all the tests are done we're going to close our server
//and rollback our database.
afterAll(async () => {
    //This closes the app but it doesn't stop the tests in
    //Jest when done - that's why we have to --forceExit
    //when running Jest for now.
    return server.close()
});

describe('user account actions', () => {
    const userActionController = new UserActionController()

    it('signs up a user', async () => {
        mock.onPost('/api/v1/user/signup').reply(function() {
            return [200, { foo: 'bar' }];
        });

        expect.assertions(1)
        //const response = await axios.post('/api/v1/user/signup')
        let ctx = {
            request: {
                body: {
                    "firstName": "John",
                    "lastName": "Datserakis",
                    "username": "johndatserakis@gmail.com",
                    "email": "johndatserakis@gmail.com",
                    "password": "Houses123993"
                }
            }
        }
        const response = await userActionController.signup(ctx);
        expect(response.status).toBe(200)
    });





    // beforeAll(async () => {
    //     await db.migrate.rollback()
    //     await db.migrate.latest()
    // });

    // it('signs up a user', async () => {
    //     expect.assertions(1)
    //     const response = await request.post('/api/v1/user/signup', {
    //         "firstName": "TestFirstName",
    //         "lastName": "TestLastName",
    //         "username": "TestUsername",
    //         "email": "TestEmail@example.com",
    //         "password": "TestPassword"
    //     })
    //     expect(response.status).toBe(200)
    // });

    // it('authenticates a user', async () => {
    //     expect.assertions(1)
    //     const response = await request.post('/api/v1/user/authenticate', {
    //         "username": "TestUsername",
    //         "password": "TestPassword"
    //     })
    //     expect(response.status).toBe(200)
    // });
})