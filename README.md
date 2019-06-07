<p align="center"><a href="https://koa-vue-notes-web.innermonkdesign.com/" target="_blank"><img width="200" src="./src/static/koa-vue-notes-icon.png"></a></p>

<p align="center">
  <a href="http://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  <a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjohndatserakis%2Fkoa-vue-notes-api&text=Check%20out%20koa-vue-notes-api%20on%20GitHub&via=innermonkdesign">
  <img src="https://img.shields.io/twitter/url/https/github.com/johndatserakis/koa-vue-notes-api.svg?style=social" alt="Tweet"></a>
</p>

# Koa-Vue-Notes-Api

This is a simple SPA built using [Koa](http://koajs.com/) (2.5.1) as the backend and [Vue](https://vuejs.org/) (2.5.16) as the frontend. Click [here](https://github.com/johndatserakis/koa-vue-notes-web) to see the frontend Vue code. Also, you can check out [koa-react-notes-web](https://koa-react-notes-web.innermonkdesign.com) for the React implementation of this exact project! Click [here](https://koa-vue-notes-web.innermonkdesign.com/) to view the app live. You can also check out the [koa-vue-notes-project](https://github.com/johndatserakis/koa-vue-notes-project) repo if you like to have both your frontend and backend living within the same folder.

## Note - Now updated to Koa 2.5.1!

## Features
- Koa 2.5.1
- Fully written using async/await
- Koa-Router
- Koa-Ratelimit
- Koa-Bodyparser
- KCors
- Koa-Json-Error for JSON requests/responses
- Koa-Useragent to get client user-agent data
- Bcrypt
- Sendgrid Mailer for email
- Joi for input validation
- Fs-Extra
- JWT
- Nodemon for running in development
- Prettier
- Babel
- PM2 for running in production
- MySQL
- Knex with migrations and seeds
- Jest for testing
- Faker to create seeds
- log4js for logging
- Docker server
- And more...

## Installing / Getting started

``` bash
# install dependencies
npm install

# serve using nodemon with hot reload
npm run watch

# build for production with prettier and babel
npm run build

# serve in production using the pm2 ecosystem.json file
npm run start-production

# run prettier on the project
npm run pretty

# run tests
npm run test

## knex migrations ##
## note - all knex migrate/rollback/seed calls must be prefaced
## with the setting of NODE_ENV - also, seeds and rollbacks are
## disabled in production

# migrate latest
NODE_ENV=development knex migrate:latest

# rollback
NODE_ENV=development knex migrate:rollback

# run all seeds
NODE_ENV=development knex seed:run

## knex seed and migration make commands ##

# make migration
knex migrate:make create_users_table

# make seed
knex seed:make seed_users

```

#### Note
You'll need to make sure you have redis running (for the rate-limiter). I use homebrew. You can follow [this](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298) guide. After installing and running redis, you should be able to enter `redis-cli ping` into a terminal and get `PONG` back.

## General Information

This backend is part of a pair of projects that serve a simple notes app. I chose a notes app because it gives you a good look at the different techniques used in both the frontend and backend world. What's really cool is these projects feature a fully fleshed-out user login/signup/forgot/reset authentication system using JWT.

I've liberally commented the code and tried to balance the project in a way that it's complex enough to learn from but not so complex that it's impossible to follow. It can be tough to learn from a boilerplate that has too much or too little.

Having used mainly PHP for the backend in the past - I am very glad I checked out Koa as I think it is absolutely awesome in the way it handles the server code. Same thing with Vue - I've used mainly jQuery in the past - albeit with the really structured Revealing-Module-Pattern - and using Vue was such a pleasure. You can really tell right away what kind of power a well-structured library can give you.

You'll need to create a `.env` file and place it in the root of your directory. Take a look at `example.env` and add your information as needed. For `JWT_ACCESS_TOKEN_EXPIRATION_TIME` you can set it to 5m, 5w, 5d etc - although 5m is what I'm using at the moment. Note - we don't set the NODE_ENV variable in the `.env` - we set it in the npm scripts. This lets us specifically set different environments as needed. Also make sure to set the `JWT_SECRET` variable - something random around 32 characters.

This project only responds and listens in JSON. Keep that in mind when send requests through Postman or your frontend.

### User Authentication Process

As mentioned in the frontend code, the user authentication process is this:

- User create an account
- User logs in
- The server sends and `accessToken` and a `refreshToken` back
- We take the `accessToken` and decode it using `jwt-decode`. This gets us the logged in user's information. We stick this in the Vuex variable `user`. Then we store the `refreshToken` amd `accessToken`.
- Each protected endpoint will be expecting you to attach the `accessToken` you have to the call (using Authentication: Bearer). After a short amount of time, the server will respond with `401 TOKEN EXPIRED`. When you see this - that means you need to send your `refreshToken` and `user.email` to the endpoint that deals with `accessToken` refreshing. Once you do that, you'll received a brand new `accessToken` and `refreshToken`.
- Repeat the process as needed.

### PM2

This project features an `ecosystem.json` file that is the target of the PM2 implementation in production. Very simple - we just give it a name and some other basic info and PM2 handles the rest. Great library with awesome documentation.

The `src` folder is the heart of the program. I'll go over its subfolders now.

### controllers

We use controllers to keep our router thin. The controller's responsibility is to manage the request body and make sure it's nice and clean when it eventually gets sent to a `model` to make database calls. There are two controller files present - one for user signup/login/forgot... and one for notes. Note: the `UserActionController.js` is a little different then normal controllers, as I believe the actions of a user signup/login/forgot/reset are seperate from the normal actions for a user - so that's why `UserActionController.js` in written in a more *functional* way.

### db

Here is our database setup. This project uses Knex to manage migrations and execute queries. I initially wrote wrote all the MySQL calls using raw SQL, but the need for a migrations manager pushed me towards an ORM for the MySQL database. Knex is awesome - very powerful, easy to use and make queries, and the migrations are nice to have for sure - especially for testing.

For this project you'll need to make two databases in your development environment, `koa_vue_notes_development` and `koa_vue_notes_testing`. In your production environment you would just have `koa_vue_notes_production`. Tests use a different database because the data there is extremely volatile - as table information is created and destroyed on every test. The `knexfile.js` used here dynamically attaches to the proper database based the `NODE_ENV`.

The `knexfile.js` in the root of the project is all setup with the ability to read your `.env` file. Make sure to have knex installed globally, `npm install -g knex`. Let's say you download this project - first you'll `npm install`, then create a `koa_vue_notes` database and a `koa_vue_notes_testing` database, then `knex migrate:latest` and `knex seed:run` to create and seed your tables. Currently it's set up to make five users and 100 notes distributed to those users.

### Docker

Docker is used for the development virtual machine. To use the included dockerfile.yml, run `docker-compose up -d --build` to bring up the machine. To stop the machine, run `docker-compose down`. The main reason docker is used in this case is to host the MySQL database. Make a database named `koa-vue-notes_development`. Connect through Sequel Pro using `host: 127.0.0.1`, `port: 3360`, `user: root`, and `password: docker`.

### middleware

Here I place any custom middleware the app is using. The custom middleware we're using is based on the `koa-jwt` library - but I had to tweak it because it mysteriously didn't report an expired token correctly. Strange, as I thought that would be an important requirement. No biggie.

### models

Our models folder contains two model files - one for users and one for notes. These models are where the actual database calls are made. This keeps things nice and neat - also make actions reusable for the future.

### routes

Very simple - here are our routes. I've broken it down into two files - this keeps things in control. Each route is nice and thin - all it's doing is calling a controller. Some routes are using that jwt middleware I mentioned earlier. Koa make it really nice and easy to add middleware to a route. Very cool.

### static

Static files - just used for the favicon.

### index.js

index.js isn't a folder - it's the brain of the app. Here you'll see we are attaching a bunch of middleware to our Koa instance. Very slick and straight-forward.

### Testing

This project uses Jest for testing. Bascially, each API endpoint is tested with working request data to confirm the server behaves correctly when spoken to. Each time the tests are run the migrations get kicked into gear. After the tests are complete the testing database rolls-back - ready for the next test.

## Hit Me Up

Go ahead and fork the project! Message me here if you have questions or submit an issue if needed. I'll be making touch-ups as time goes on. Have fun with this!

## License

Copywrite 2017 John Datserakis

[MIT](http://opensource.org/licenses/MIT)
