const faker = require('faker')
const bcrypt = require('bcrypt')

exports.seed = async function(knex, Promise) {
    //Make 10 users using faker. Note: we're also bcrypting
    //the passwords to make it exactly like the real app. All their
    //passwords will be 'secret'
    let seedData = []
    for (let i = 0; i < 5; i++) {
        let password = 'secret'
        try {
            password = await bcrypt.hash(password, 12)
        } catch (error) {
            throw new Error('PASSWORD_ENCRIPTION_ERROR')
        }

        let testUser = {
            token: faker.internet.password(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: password,
        }
        seedData.push(testUser)
    }

    // Deletes ALL existing entries
    await knex('users').truncate()

    //Insert users
    await knex('users').insert(seedData)
}
