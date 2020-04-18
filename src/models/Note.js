import db from "../db/db";

// Helpers

async function findById(id) {
  try {
    const [noteData] = await db("notes")
      .select("id", "userId", "title", "content")
      .where({ id });
    return noteData;
  } catch (error) {
    console.log(error);
    throw new Error("ERROR");
  }
}

// Class

class Note {
  constructor(data) {
    if (!data) {
      return;
    }

    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
    this.content = data.content;
    this.ipAddress = data.ipAddress;
  }

  // eslint-disable-next-line class-methods-use-this
  async all(request) {
    try {
      return await db("notes")
        .select("*")
        .where({ userId: request.userId })
        .where("title", "like", `%${request.sort ? request.sort : ""}%`)
        .orderBy("createdAt", request.order)
        .offset(+request.page * +request.limit)
        .limit(+request.limit);
    } catch (error) {
      console.log(error);
      throw new Error("ERROR");
    }
  }

  async find(id) {
    try {
      const result = await findById(id);
      if (!result) return {};
      this.constructor(result);
    } catch (error) {
      console.log(error);
      throw new Error("ERROR");
    }
  }

  async store() {
    try {
      return await db("notes").insert(this).returning("id");
    } catch (error) {
      console.log(error);
      throw new Error("ERROR");
    }
  }

  async save() {
    try {
      return await db("notes")
        .update(this)
        .where({ id: this.id })
        .returning("id");
    } catch (error) {
      console.log(error);
      throw new Error("ERROR");
    }
  }

  async destroy() {
    try {
      return await db("notes").delete().where({ id: this.id });
    } catch (error) {
      console.log(error);
      throw new Error("ERROR");
    }
  }
}

export { Note, findById };
