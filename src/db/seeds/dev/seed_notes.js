import { random, lorem } from "faker";

// I only want migrations, rollbacks, and seeds to run when the NODE_ENV is specified
// in the knex seed/migrate command. Knex will error out if it is not specified.
if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV not set");
}

// We don't want seeds to run in production
if (process.env.NODE_ENV === "production") {
  throw new Error("Can't run seeds in production");
}

export const seed = async (knex) => {
  // Make 100 notes for 10 different users
  const seedData = [];
  for (let i = 0; i < 100; i += 1) {
    const testNote = {
      userId: random.number({ min: 1, max: 5 }),
      title: lorem.sentence(),
      content: lorem.sentences(Math.floor(Math.random() * 10) + 1),
    };
    seedData.push(testNote);
  }

  // Deletes ALL existing entries
  await knex("notes").truncate();

  // Insert users
  await knex("notes").insert(seedData);
};
