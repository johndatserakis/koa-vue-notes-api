// I only want migrations, rollbacks, and seeds to run when the NODE_ENV is specified
// in the knex seed/migrate command. Knex will error out if it is not specified.
if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV not set");
}

export const up = (knex) => {
  return knex.schema.createTable("refresh_tokens", (table) => {
    table.charset("utf8mb4");
    table.collate("utf8mb4_unicode_ci");

    table.increments("id").primary();
    table.string("username").notNullable();
    table.string("refreshToken").notNullable();
    table.string("info");
    table.boolean("isValid").defaultTo(false).notNullable();
    table.timestamp("expiration").nullable();
    table.string("ipAddress");

    table
      .dateTime("updatedAt")
      .defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
    table
      .dateTime("createdAt")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });
};

export const down = (knex) => {
  // We never want to drop tables in production
  if (process.env.NODE_ENV !== "production") {
    return knex.schema.dropTableIfExists("refresh_tokens");
  }
};
