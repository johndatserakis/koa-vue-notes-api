const axios = require('axios')
const app = require('../app')
const url = `http://localhost:4000/api/v1/`
const request = axios.create({ baseURL: url })

it('return homepage', async () => {
    const response = await request.get('/')
    expect(response.statusCode).toBe(200)
    done()
});