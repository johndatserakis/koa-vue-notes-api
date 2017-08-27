const axios = require('axios')
const app = require('../app')
const url = `http://localhost:4000`
const request = axios.create({ baseURL: url })

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
