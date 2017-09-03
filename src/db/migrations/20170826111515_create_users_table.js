//I only want migrations, rollbacks, and seeds to run when the NODE_ENV is specified
//in the knex seed/migrate command. Knex will error out if it is not specified.
if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') }

exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary()
        table.string('token').notNullable()
        table.string('firstName').notNullable()
        table.string('lastName').notNullable()
        table
            .string('username')
            .notNullable()
            .unique()
        table
            .string('email')
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
        table.timestamp('updatedAt').nullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
    })
}

exports.down = function(knex, Promise) {
    //We never want to drop tables in production
    if (process.env.NODE_ENV !== 'production') {
        return knex.schema.dropTableIfExists('users')
    }
}
