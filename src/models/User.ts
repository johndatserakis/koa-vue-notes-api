import db from "../db/db";
import { logger } from "../logs/log";

export type UserTokens = {
  accessToken: string;
  refreshToken: string;
};

export const findById = async (id: string) => {
  try {
    const [userData] = await db("users")
      .select("id", "token", "username", "email", "isAdmin")
      .where({ id });
    return userData;
  } catch (error) {
    logger.error(error);
    throw new Error("ERROR");
  }
}

export class User {
  id?: number;
  token?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  passwordResetToken?: string;
  passwordResetExpiration?: string;
  sendPromotionalEmails?: boolean;
  isAdmin?: boolean;
  isDeleted?: boolean;
  loginCount?: number;
  ipAddress?: string;
  updatedAt?: Date;
  createdAt?: Date;

  constructor(data?: User) {
    if (!data) { return; }

    this.init(data);
  }

  init(data: User) {
    if (!data) {
      return;
    }

    this.id = data.id;
    this.token = data.token;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.passwordResetToken = data.passwordResetToken;
    this.passwordResetExpiration = data.passwordResetExpiration;
    this.sendPromotionalEmails = data.sendPromotionalEmails;
    this.isAdmin = data.isAdmin;
    this.isDeleted = data.isDeleted;
    this.loginCount = data.loginCount;
    this.ipAddress = data.ipAddress;
    this.updatedAt = data.updatedAt;
    this.createdAt = data.createdAt;
  }
}
