require("dotenv").config();

const env = process.env.NODE_ENV || "development";
const port = process.env.PORT || 4000;
const src = env === "production" ? "./dist/index" : "./src/index";

// eslint-disable-next-line import/no-dynamic-require
const { app } = require(src);

// Here we're assigning the server to a variable because
// we're going to want to manually rip down the server in testing
const server = app.listen(port);

// eslint-disable-next-line no-console
console.log(`Server running at ${port}`);

// eslint-disable-next-line no-console
console.log(`Running in ${process.env.NODE_ENV} v${process.env.IMAGE_TAG}`);

// Exporting the actual server here for testing availability
module.exports = { server };
