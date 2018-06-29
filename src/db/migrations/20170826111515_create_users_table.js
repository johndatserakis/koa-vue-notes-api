//I only want migrations, rollbacks, and seeds to run when the NODE_ENV is specified
//in the knex seed/migrate command. Knex will error out if it is not specified.
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}

exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')

        table.increments('id').primary()
        table.string('token').notNullable()
        table.string('firstName').notNullable()
        table.string('lastName').notNullable()
        table
            .string('username', 191)
            .notNullable()
            .unique()
        table
            .string('email', 191)
            .notNullable()
            .unique()
        table.string('password').notNullable()
        table.string('passwordResetToken')
        table.timestamp('passwordResetExpiration').nullable()
        table
            .boolean('sendPromotionalEmails')
            .defaultTo(false)
            .notNullable()
        table
            .boolean('isAdmin')
            .defaultTo(false)
            .notNullable()
        table
            .boolean('isDeleted')
            .defaultTo(false)
            .notNullable()
        table.integer('loginCount').defaultTo(0)
        table.string('ipAddress')

        table
            .dateTime('updatedAt')
            .defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'))
        table
            .dateTime('createdAt')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    })
}

exports.down = function(knex, Promise) {
    //We never want to drop tables in production
    if (process.env.NODE_ENV !== 'production') {
        return knex.schema.dropTableIfExists('users')
    }
}
