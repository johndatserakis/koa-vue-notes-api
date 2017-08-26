const axios = require('axios')
const app = require('../app')
const url = `http://localhost:4000`
const request = axios.create({ baseURL: url })

it('returns homepage', async () => {
    expect.assertions(1)
    const response = await request.get('/')
    expect(response.status).toBe(200)
});
