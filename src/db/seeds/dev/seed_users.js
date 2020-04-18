import { internet, name } from "faker";

// I only want migrations, rollbacks, and seeds to run when the NODE_ENV is specified
// in the knex seed/migrate command. Knex will error out if it is not specified.
if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV not set");
}

// We don't want seeds to run in production
if (process.env.NODE_ENV === "production") {
  throw new Error("Can't run seeds in production");
}

const bcrypt = require("bcrypt");

export const seed = async (knex) => {
  // Make 10 users using faker. Note: we're also bcrypting
  // the passwords to make it exactly like the real app. All their
  // passwords will be 'secret'
  const seedData = [];
  for (let i = 0; i < 5; i += 1) {
    let password = "demopassword";
    try {
      // eslint-disable-next-line no-await-in-loop
      password = await bcrypt.hash(password, 12);
    } catch (error) {
      throw new Error("PASSWORD_ENCRIPTION_ERROR");
    }

    if (i === 0) {
      const testUser = {
        token: "qwertyuiop",
        firstName: "DemoFirstName",
        lastName: "DemoLastName",
        username: "demousername",
        email: "demoemail@example.com",
        password,
      };
      seedData.push(testUser);
      // eslint-disable-next-line no-continue
      continue;
    }

    const testUser = {
      token: internet.password(),
      firstName: name.firstName(),
      lastName: name.lastName(),
      username: internet.userName(),
      email: internet.email(),
      password,
    };
    seedData.push(testUser);
  }

  // Deletes ALL existing entries
  await knex("users").truncate();

  // Insert users
  await knex("users").insert(seedData);
};
