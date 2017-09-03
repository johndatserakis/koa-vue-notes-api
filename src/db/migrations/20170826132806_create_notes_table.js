//I only want migrations, rollbacks, and seeds to run when the NODE_ENV is specified
//in the knex seed/migrate command. Knex will error out if it is not specified.
if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') }

exports.up = function(knex, Promise) {
    return knex.schema.createTable('notes', function(table) {
        table.increments('id').primary()
        table.integer('userId')
        table.string('title')
        table.text('content')
        table.string('ipAddress')
        table.timestamp('updatedAt').nullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
    })
}

exports.down = function(knex, Promise) {
    //We never want to drop tables in production
    if (process.env.NODE_ENV !== 'production') {
        return knex.schema.dropTableIfExists('notes')
    }
}
