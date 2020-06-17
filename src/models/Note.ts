import db from "../db/db";
import { logger } from "../logs/log";

export type NotesQuery = {
  sort: string;
  order: "desc" | "asc";
  page: number;
  limit: number;
};

export const findById = async (id: string) => {
  try {
    const [noteData] = await db("notes")
      .select("id", "userId", "title", "content")
      .where({ id });
    return noteData;
  } catch (error) {
    logger.error(error);
    throw new Error("ERROR");
  }
}

export class Note {
  id?: number;
  userId?: number;
  title?: string;
  content?: string;
  ipAddress?: string;
  updatedAt?: Date;
  createdAt?: Date;

  constructor(data?: Note) {
    if (!data) { return; }

    this.init(data);
  }

  init(data: Note) {
    if (!data) {
      return;
    }

    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
    this.content = data.content;
    this.ipAddress = data.ipAddress;
    this.updatedAt = data.updatedAt;
    this.createdAt = data.createdAt;
  }

  // eslint-disable-next-line class-methods-use-this
  async all(request: NotesQuery & {userId: string}) {
    try {
      return await db("notes")
        .select("*")
        .where({ userId: request.userId })
        .where("title", "like", `%${request.sort ? request.sort : ""}%`)
        .orderBy("createdAt", request.order)
        .offset(+request.page * +request.limit)
        .limit(+request.limit);
    } catch (error) {
      logger.error(error);
      throw new Error("ERROR");
    }
  }

  async find(id: string) {
    try {
      const result = await findById(id);
      if (!result) return {};
      this.init(result);
    } catch (error) {
      logger.error(error);
      throw new Error("ERROR");
    }
  }

  async store() {
    try {
      return await db("notes").insert(this);
    } catch (error) {
      logger.error(error);
      throw new Error("ERROR");
    }
  }

  async save() {
    try {
      return await db("notes").update(this).where({ id: this.id });
    } catch (error) {
      logger.error(error);
      throw new Error("ERROR");
    }
  }

  async destroy() {
    try {
      return await db("notes").delete().where({ id: this.id });
    } catch (error) {
      logger.error(error);
      throw new Error("ERROR");
    }
  }
}
