require("dotenv").config();

const env = process.env.NODE_ENV || "development";
const port = process.env.PORT || 4000;
const src = "./index";

const { app } = require(src);

// Here we're assigning the server to a variable because
// we're going to want to manually rip down the server in testing
export const server = app.listen(port);

// eslint-disable-next-line no-console
console.log(`Server running at ${port}`);

// eslint-disable-next-line no-console
console.log(`Running in ${env} v${process.env.IMAGE_TAG}`);
