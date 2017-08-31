exports.up = function(knex, Promise) {
    return knex.schema.createTable('refresh_tokens', function(table) {
        table.increments('id').primary()
        table.string('username').notNullable()
        table.string('refreshToken').notNullable()
        table.string('info')
        table
            .boolean('isValid')
            .defaultTo(false)
            .notNullable()
        table.timestamp('expiration').nullable()
        table.string('ipAddress')
        table.timestamp('updatedAt').nullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('refresh_tokens')
}
