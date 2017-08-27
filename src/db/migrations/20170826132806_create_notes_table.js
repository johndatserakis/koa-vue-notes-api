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
    return knex.schema.dropTableIfExists('notes')
}
