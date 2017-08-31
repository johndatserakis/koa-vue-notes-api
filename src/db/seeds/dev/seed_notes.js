const faker = require('faker')

exports.seed = async function(knex, Promise) {
    //Make 100 notes for 10 different users
    let seedData = []
    for (let i = 0; i < 100; i++) {
        let testNote = {
            userId: faker.random.number({ min: 1, max: 5 }),
            title: faker.lorem.sentence(),
            content: faker.lorem.sentences(Math.floor(Math.random() * 10) + 1),
        }
        seedData.push(testNote)
    }

    // Deletes ALL existing entries
    await knex('notes').truncate()

    //Insert users
    await knex('notes').insert(seedData)
}
