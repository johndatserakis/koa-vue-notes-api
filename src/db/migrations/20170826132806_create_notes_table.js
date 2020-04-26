// I only want migrations, rollbacks, and seeds to run when the NODE_ENV is specified
// in the knex seed/migrate command. Knex will error out if it is not specified.
if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV not set");
}

export const up = (knex) => {
  return knex.schema.createTable("notes", (table) => {
    table.charset("utf8mb4");
    table.collate("utf8mb4_unicode_ci");

    table.increments("id").primary();
    table.integer("userId");
    table.string("title");
    table.text("content");
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
    return knex.schema.dropTableIfExists("notes");
  }
};
