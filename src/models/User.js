import db from "../db/db";
import { logger } from "../logs/log";

// Helpers

async function findById(id) {
  try {
    const [userData] = db("users")
      .select("id", "token", "username", "email", "isAdmin")
      .where({ id });
    return userData;
  } catch (error) {
    logger.error(error);
    throw new Error("ERROR");
  }
}

// Class

class User {
  constructor(data) {
    if (!data) {
      return;
    }

    this.id = data.id;
    this.token = data.token;
    this.username = data.username;
    this.email = data.email;
    this.isAdmin = data.isAdmin;
  }
}

export { User, findById };
