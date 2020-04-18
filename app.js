require("dotenv").config();

const env = process.env.NODE_ENV || "development";
const port = process.env.PORT || 4000;
const src = env === "production" ? "./build/index" : "./src/index";

require("@babel/polyfill");

if (env === "development") {
  // eslint-disable-next-line global-require
  require("@babel/register");
}

// eslint-disable-next-line import/no-dynamic-require
const { app } = require(src);

// Here we're assigning the server to a variable because
// we're going to want to manually rip down the server in testing
const server = app.listen(port);
// eslint-disable-next-line no-console
console.log(`Server running at ${port}`);
// eslint-disable-next-line no-console
console.log(
  `Running in ${process.env.NODE_ENV} v${process.env.npm_package_version}`,
);

// Exporting the actual server here for testing availability
module.exports = { server };
