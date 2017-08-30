import {server} from '../app'
import axios from 'axios'
// axios.defaults.baseURL = `http://localhost:4000`
import MockAdapter from 'axios-mock-adapter';
// const baseUrl = `http://localhost:4000`
const mock = new MockAdapter(axios);

//After all the tests are done we're going to close our server
//and rollback our database.
afterAll(async () => {
    //This closes the app but it doesn't stop the tests in
    //Jest when done - that's why we have to --forceExit
    //when running Jest for now.
    return server.close()
});

describe('user account actions', () => {

    it('signs up a user', async () => {
        mock.onPost('/api/v1/user/signup').reply(function() {
            return [200, { foo: 'bar' }];
        });

        // axios.get('/foo1')
        //     .then(function(response) {
        //         console.log(response.data);
        //         expect(response.status).toBe(200)
        //     })
        //     .catch(function(error) {
        //         throw new Error(error)
        //     })


        expect.assertions(1)
        const response = await axios.post('/api/v1/user/signup')
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