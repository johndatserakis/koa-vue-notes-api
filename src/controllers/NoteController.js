import joi from "joi";
import dateFormat from "date-fns/format";

import { User } from "../models/User";
import { Note } from "../models/Note";

const noteSchema = joi.object({
  id: joi.number().integer(),
  userId: joi.number().integer().required(),
  title: joi.string().required(),
  content: joi.string().required(),
  ipAddress: joi.string(),
});

export const index = async (ctx) => {
  const { query } = ctx;

  // Attach logged in user
  const user = new User(ctx.state.user);
  query.userId = user.id;

  // Init a new note object
  const note = new Note();

  // Let's check that the sort options were set. Sort can be empty
  if (!query.order || !query.page || !query.limit) {
    ctx.throw(400, "INVALID_ROUTE_OPTIONS");
  }

  // Get paginated list of notes
  try {
    const result = await note.all(query);
    ctx.body = { data: { notes: result } };
  } catch (error) {
    console.log(error);
    ctx.throw(400, `INVALID_DATA${error}`);
  }
};

export const show = async (ctx) => {
  const { params } = ctx;
  if (!params.id)
    ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });

  // Initialize note
  const note = new Note();

  try {
    // Find and show note
    await note.find(params.id);
    ctx.body = { data: { note } };
  } catch (error) {
    console.log(error);
    ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });
  }
};

export const create = async (ctx) => {
  const request = ctx.request.body;

  // Attach logged in user
  const user = new User(ctx.state.user);
  request.userId = user.id;

  // Add ip
  request.ipAddress = ctx.ip;

  // Create a new note object using the request params
  const note = new Note(request);

  // Validate the newly created note
  const validator = joi.validate(note, noteSchema);
  if (validator.error) ctx.throw(400, validator.error.details[0].message);

  try {
    const [resultId] = await note.store();
    note.id = resultId;
    ctx.body = { data: { note } };
  } catch (error) {
    console.log(error);
    ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });
  }
};

export const update = async (ctx) => {
  const { params } = ctx;
  const request = ctx.request.body;

  // Make sure they've specified a note
  if (!params.id)
    ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });

  // Find and set that note
  const note = new Note();
  await note.find(params.id);
  if (!note) ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });

  // Grab the user, if it's not their note - error out
  const user = new User(ctx.state.user);
  if (note.userId !== user.id)
    ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });

  // Add the updated date value
  request.updatedAt = dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss");

  // Add the ip
  request.ipAddress = ctx.ip;

  // Replace the note data with the new updated note data
  Object.keys(ctx.request.body).forEach((parameter) => {
    note[parameter] = request[parameter];
  });

  try {
    await note.save();
    ctx.body = { data: { note } };
  } catch (error) {
    console.log(error);
    ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });
  }
};

export const del = async (ctx) => {
  const { params } = ctx;
  if (!params.id)
    ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });

  // Find that note
  const note = new Note();
  await note.find(params.id);
  if (!note) ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });

  // Grab the user //If it's not their note - error out
  const user = new User(ctx.state.user);
  if (note.userId !== user.id)
    ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });

  try {
    await note.destroy();
    ctx.body = { data: {} };
  } catch (error) {
    console.log(error);
    ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });
  }
};
