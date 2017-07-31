'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('dotenv/config');

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _randexp = require('randexp');

var _randexp2 = _interopRequireDefault(_randexp);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _mail = require('@sendgrid/mail');

var _mail2 = _interopRequireDefault(_mail);

var _format = require('date-fns/format');

var _format2 = _interopRequireDefault(_format);

var _add_minutes = require('date-fns/add_minutes');

var _add_minutes2 = _interopRequireDefault(_add_minutes);

var _add_months = require('date-fns/add_months');

var _add_months2 = _interopRequireDefault(_add_months);

var _compare_asc = require('date-fns/compare_asc');

var _compare_asc2 = _interopRequireDefault(_compare_asc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_mail2.default.setApiKey(process.env.SENDGRID_API_KEY);

var userSchemaSignup = _joi2.default.object({
    firstName: _joi2.default.string().min(1).max(25).alphanum().required(),
    lastName: _joi2.default.string().min(1).max(25).alphanum().required(),
    username: _joi2.default.string().min(3).max(100).regex(/[a-zA-Z0-9@]/).required(),
    email: _joi2.default.string().email().required(),
    password: _joi2.default.string().min(8).max(35).required()
});

var userSchemaResetPassword = _joi2.default.object({
    email: _joi2.default.string().email().required(),
    password: _joi2.default.string().min(8).max(35).required(),
    passwordResetToken: _joi2.default.string().required()
});

var UserController = function () {
    function UserController() {
        _classCallCheck(this, UserController);
    }

    _createClass(UserController, [{
        key: 'signup',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
                var validator, count, result, email, emailData;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                //First do validation on the input
                                validator = _joi2.default.validate(ctx.request.body, userSchemaSignup);

                                if (validator.error) {
                                    ctx.throw(400, validator.error.details[0].message);
                                }

                                //Now let's check for a duplicate username
                                _context.next = 4;
                                return _db2.default.query('SELECT COUNT(id) as count FROM koa_vue_notes_users WHERE username = ?', ctx.request.body.username);

                            case 4:
                                count = _context.sent;

                                if (count[0].count) {
                                    ctx.throw(400, 'DUPLICATE_USERNAME');
                                }

                                //And now for a duplicate email
                                _context.next = 8;
                                return _db2.default.query('SELECT COUNT(id) as count FROM koa_vue_notes_users WHERE email = ?', ctx.request.body.email);

                            case 8:
                                count = _context.sent;

                                if (count[0].count) {
                                    ctx.throw(401, 'DUPLICATE_EMAIL');
                                }

                                //Now let's generate a token for this user
                                _context.next = 12;
                                return this.generateUniqueToken();

                            case 12:
                                ctx.request.body.token = _context.sent;
                                _context.prev = 13;
                                _context.next = 16;
                                return _bcrypt2.default.hash(ctx.request.body.password, 12);

                            case 16:
                                ctx.request.body.password = _context.sent;
                                _context.next = 22;
                                break;

                            case 19:
                                _context.prev = 19;
                                _context.t0 = _context['catch'](13);

                                ctx.throw(400, _context.t0);

                            case 22:

                                //Let's grab their ipaddress
                                ctx.request.body.ipAddress = ctx.request.ip;

                                //Ok, at this point we can sign them up.
                                _context.prev = 23;
                                _context.next = 26;
                                return _db2.default.query('INSERT INTO koa_vue_notes_users SET ?', ctx.request.body);

                            case 26:
                                result = _context.sent;
                                _context.next = 29;
                                return _fsExtra2.default.readFile('./src/email/welcome.html', 'utf8');

                            case 29:
                                email = _context.sent;
                                emailData = {
                                    to: ctx.request.body.email,
                                    from: process.env.APP_EMAIL,
                                    subject: 'Welcome To Koa-Vue-Notes-Api',
                                    html: email,
                                    categories: ['koa-vue-notes-api-new-user'],
                                    substitutions: {
                                        appName: process.env.APP_NAME,
                                        appEmail: process.env.APP_EMAIL
                                    }
                                };
                                _context.next = 33;
                                return _mail2.default.send(emailData);

                            case 33:

                                //And return our response.
                                ctx.body = { message: 'SUCCESS' };
                                _context.next = 39;
                                break;

                            case 36:
                                _context.prev = 36;
                                _context.t1 = _context['catch'](23);

                                ctx.throw(400, _context.t1);

                            case 39:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[13, 19], [23, 36]]);
            }));

            function signup(_x) {
                return _ref.apply(this, arguments);
            }

            return signup;
        }()
    }, {
        key: 'authenticate',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
                var userData, correct, refreshTokenData, token;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!ctx.request.body.username || !ctx.request.body.password) {
                                    ctx.throw(404, 'INVALID_DATA');
                                }

                                //Let's find that user
                                _context2.next = 3;
                                return _db2.default.query('SELECT id, token, username, email, password, admin FROM koa_vue_notes_users WHERE username = ?', ctx.request.body.username);

                            case 3:
                                userData = _context2.sent;

                                if (!userData.length) {
                                    ctx.throw(401, 'INVALID_CREDENTIALS');
                                }

                                //Now let's check the password
                                _context2.prev = 5;
                                _context2.next = 8;
                                return _bcrypt2.default.compare(ctx.request.body.password, userData[0].password);

                            case 8:
                                correct = _context2.sent;

                                if (!correct) {
                                    ctx.throw(400, 'INVALID_CREDENTIALS');
                                }
                                _context2.next = 15;
                                break;

                            case 12:
                                _context2.prev = 12;
                                _context2.t0 = _context2['catch'](5);

                                ctx.throw(400, _context2.t0);

                            case 15:

                                //Let's get rid of that password now for security reasons
                                delete userData[0].password;

                                //Generate the refreshToken data
                                refreshTokenData = {
                                    username: userData[0].username,
                                    refreshToken: new _randexp2.default(/[a-zA-Z0-9_-]{64,64}/).gen(),
                                    info: ctx.userAgent.os + ' ' + ctx.userAgent.platform + ' ' + ctx.userAgent.browser,
                                    ipAddress: ctx.request.ip,
                                    expiration: (0, _add_months2.default)(new Date(), 1)
                                };

                                //Insert the refresh data into the db

                                _context2.prev = 17;
                                _context2.next = 20;
                                return _db2.default.query('INSERT INTO koa_vue_notes_refresh_tokens SET ?', refreshTokenData);

                            case 20:
                                _context2.next = 25;
                                break;

                            case 22:
                                _context2.prev = 22;
                                _context2.t1 = _context2['catch'](17);

                                ctx.throw(400, _context2.t1);

                            case 25:

                                //Ok, they've made it, send them their jsonwebtoken with their data, accessToken and refreshToken
                                token = _jsonwebtoken2.default.sign({ data: userData }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME });

                                ctx.body = {
                                    access_token: token,
                                    refreshToken: refreshTokenData.refreshToken
                                };

                            case 27:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[5, 12], [17, 22]]);
            }));

            function authenticate(_x2) {
                return _ref2.apply(this, arguments);
            }

            return authenticate;
        }()
    }, {
        key: 'refreshAccessToken',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
                var refreshTokenDatabaseData, refreshTokenIsValid, userData, refreshTokenData, token;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!ctx.request.body.username || !ctx.request.body.refreshToken) ctx.throw(401, 'NO_REFRESH_TOKEN');

                                //Let's find that user and refreshToken in the refreshToken table
                                _context3.next = 3;
                                return _db2.default.query('SELECT username, refreshToken, expiration FROM koa_vue_notes_refresh_tokens WHERE (username = ? AND refreshToken = ? AND isValid = 1)', [ctx.request.body.username, ctx.request.body.refreshToken]);

                            case 3:
                                refreshTokenDatabaseData = _context3.sent;

                                if (!refreshTokenDatabaseData.length) {
                                    ctx.throw(400, 'INVALID_REFRESH_TOKEN');
                                }

                                //Let's make sure the refreshToken is not expired
                                refreshTokenIsValid = (0, _compare_asc2.default)((0, _format2.default)(new Date(), 'YYYY-MM-DD HH:mm:ss'), refreshTokenDatabaseData[0].expiration);

                                if (refreshTokenIsValid !== -1) {
                                    ctx.throw(400, 'REFRESH_TOKEN_EXPIRED');
                                }

                                //Ok, everthing checked out. So let's invalidate the refresh token they just confirmed, and get them
                                //hooked up with a new one.
                                _context3.prev = 7;
                                _context3.next = 10;
                                return _db2.default.query('UPDATE koa_vue_notes_refresh_tokens SET isValid = 0, updatedAt = ? WHERE refreshToken = ?', [(0, _format2.default)(new Date(), 'YYYY-MM-DD HH:mm:ss'), refreshTokenDatabaseData[0].refreshToken]);

                            case 10:
                                _context3.next = 15;
                                break;

                            case 12:
                                _context3.prev = 12;
                                _context3.t0 = _context3['catch'](7);

                                ctx.throw(400, _context3.t0);

                            case 15:
                                _context3.next = 17;
                                return _db2.default.query('SELECT id, token, username, email FROM koa_vue_notes_users WHERE username = ?', refreshTokenDatabaseData[0].username);

                            case 17:
                                userData = _context3.sent;

                                if (!userData.length) {
                                    ctx.throw(401, 'INVALID_REFRESH_TOKEN');
                                }

                                //Let's gather the new refreshToken data
                                //Generate the refreshToken data
                                refreshTokenData = {
                                    username: refreshTokenDatabaseData[0].username,
                                    refreshToken: new _randexp2.default(/[a-zA-Z0-9_-]{64,64}/).gen(),
                                    info: ctx.userAgent.os + ' ' + ctx.userAgent.platform + ' ' + ctx.userAgent.browser,
                                    ipAddress: ctx.request.ip,
                                    expiration: (0, _add_months2.default)(new Date(), 1)
                                };

                                //Insert the refresh data into the db

                                _context3.prev = 20;
                                _context3.next = 23;
                                return _db2.default.query('INSERT INTO koa_vue_notes_refresh_tokens SET ?', refreshTokenData);

                            case 23:
                                _context3.next = 28;
                                break;

                            case 25:
                                _context3.prev = 25;
                                _context3.t1 = _context3['catch'](20);

                                ctx.throw(400, _context3.t1);

                            case 28:

                                //Ok, they've made it, send them their jsonwebtoken with their data, accessToken and refreshToken
                                token = _jsonwebtoken2.default.sign({ data: userData }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME });

                                ctx.body = {
                                    access_token: token,
                                    refreshToken: refreshTokenData.refreshToken
                                };

                            case 30:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[7, 12], [20, 25]]);
            }));

            function refreshAccessToken(_x3) {
                return _ref3.apply(this, arguments);
            }

            return refreshAccessToken;
        }()
    }, {
        key: 'invalidateAllRefreshTokens',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                _context4.next = 3;
                                return _db2.default.query('UPDATE koa_vue_notes_refresh_tokens SET isValid = 0, updatedAt = ? WHERE username = ?', [(0, _format2.default)(new Date(), 'YYYY-MM-DD HH:mm:ss'), ctx.state.user[0].username]);

                            case 3:
                                _context4.next = 8;
                                break;

                            case 5:
                                _context4.prev = 5;
                                _context4.t0 = _context4['catch'](0);

                                ctx.throw(400, _context4.t0);

                            case 8:

                                ctx.body = { message: 'SUCCESS' };

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 5]]);
            }));

            function invalidateAllRefreshTokens(_x4) {
                return _ref4.apply(this, arguments);
            }

            return invalidateAllRefreshTokens;
        }()
    }, {
        key: 'invalidateRefreshToken',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!ctx.request.body.refreshToken) {
                                    ctx.throw(404, 'INVALID_DATA');
                                }

                                _context5.prev = 1;
                                _context5.next = 4;
                                return _db2.default.query('UPDATE koa_vue_notes_refresh_tokens SET isValid = 0, updatedAt = ? WHERE username = ? AND refreshToken = ?', [(0, _format2.default)(new Date(), 'YYYY-MM-DD HH:mm:ss'), ctx.state.user[0].username, ctx.request.body.refreshToken]);

                            case 4:
                                _context5.next = 9;
                                break;

                            case 6:
                                _context5.prev = 6;
                                _context5.t0 = _context5['catch'](1);

                                ctx.throw(400, _context5.t0);

                            case 9:

                                ctx.body = { message: 'SUCCESS' };

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[1, 6]]);
            }));

            function invalidateRefreshToken(_x5) {
                return _ref5.apply(this, arguments);
            }

            return invalidateRefreshToken;
        }()
    }, {
        key: 'forgot',
        value: function () {
            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(ctx) {
                var resetData, resultData, email, resetUrlCustom, emailData;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (!ctx.request.body.email || !ctx.request.body.url || !ctx.request.body.type) {
                                    ctx.throw(404, 'INVALID_DATA');
                                }

                                resetData = {
                                    passwordResetToken: new _randexp2.default(/[a-zA-Z0-9_-]{64,64}/).gen(),
                                    passwordResetExpiration: (0, _add_minutes2.default)(new Date(), 30)
                                };
                                _context6.prev = 2;
                                _context6.next = 5;
                                return _db2.default.query('UPDATE koa_vue_notes_users SET ? WHERE email = ?', [resetData, ctx.request.body.email]);

                            case 5:
                                resultData = _context6.sent;

                                if (resultData.changedRows === 0) {
                                    ctx.throw(400, 'INVALID_DATA');
                                }
                                _context6.next = 12;
                                break;

                            case 9:
                                _context6.prev = 9;
                                _context6.t0 = _context6['catch'](2);

                                ctx.throw(400, _context6.t0);

                            case 12:
                                _context6.next = 14;
                                return _fsExtra2.default.readFile('./src/email/forgot.html', 'utf8');

                            case 14:
                                email = _context6.sent;
                                resetUrlCustom = void 0;

                                if (ctx.request.body.type === 'web') {
                                    resetUrlCustom = ctx.request.body.url + '?passwordResetToken=' + resetData.passwordResetToken + '&email=' + ctx.request.body.email;
                                }
                                emailData = {
                                    to: ctx.request.body.email,
                                    from: process.env.APP_EMAIL,
                                    subject: 'Password Reset For ' + process.env.APP_NAME,
                                    html: email,
                                    categories: ['koa-vue-notes-api-forgot'],
                                    substitutions: {
                                        appName: process.env.APP_NAME,
                                        email: ctx.request.body.email,
                                        resetUrl: resetUrlCustom
                                    }
                                };
                                _context6.next = 20;
                                return _mail2.default.send(emailData);

                            case 20:

                                ctx.body = { passwordResetToken: resetData.passwordResetToken };

                            case 21:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [[2, 9]]);
            }));

            function forgot(_x6) {
                return _ref6.apply(this, arguments);
            }

            return forgot;
        }()
    }, {
        key: 'checkPasswordResetToken',
        value: function () {
            var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(ctx) {
                var passwordResetData, tokenIsValid;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (!ctx.request.body.passwordResetToken || !ctx.request.body.email) {
                                    ctx.throw(404, 'INVALID_DATA');
                                }

                                _context7.next = 3;
                                return _db2.default.query('SELECT passwordResetExpiration FROM koa_vue_notes_users WHERE (email = ? AND passwordResetToken = ?)', [ctx.request.body.email, ctx.request.body.passwordResetToken]);

                            case 3:
                                passwordResetData = _context7.sent;

                                if (!passwordResetData.length) {
                                    ctx.throw(400, 'INVALID_TOKEN');
                                }

                                //Let's make sure the refreshToken is not expired
                                tokenIsValid = (0, _compare_asc2.default)((0, _format2.default)(new Date(), 'YYYY-MM-DD HH:mm:ss'), passwordResetData[0].passwordResetExpiration);

                                if (tokenIsValid !== -1) {
                                    ctx.throw(400, 'RESET_TOKEN_EXPIRED');
                                }

                                ctx.body = { message: 'SUCCESS' };

                            case 8:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function checkPasswordResetToken(_x7) {
                return _ref7.apply(this, arguments);
            }

            return checkPasswordResetToken;
        }()
    }, {
        key: 'resetPassword',
        value: function () {
            var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(ctx) {
                var validator, passwordResetData, tokenIsValid, result;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                //First do validation on the input
                                validator = _joi2.default.validate(ctx.request.body, userSchemaResetPassword);

                                if (validator.error) {
                                    ctx.throw(400, validator.error.details[0].message);
                                }

                                //Ok, let's make sure their token is correct again, just to be sure since it could have
                                //been some time between page entrance and form submission
                                _context8.next = 4;
                                return _db2.default.query('SELECT passwordResetExpiration FROM koa_vue_notes_users WHERE (email = ? AND passwordResetToken = ?)', [ctx.request.body.email, ctx.request.body.passwordResetToken]);

                            case 4:
                                passwordResetData = _context8.sent;

                                if (!passwordResetData.length) {
                                    ctx.throw(400, 'INVALID_TOKEN');
                                }
                                tokenIsValid = (0, _compare_asc2.default)((0, _format2.default)(new Date(), 'YYYY-MM-DD HH:mm:ss'), passwordResetData[0].passwordResetExpiration);

                                if (tokenIsValid !== -1) {
                                    ctx.throw(400, 'RESET_TOKEN_EXPIRED');
                                }

                                //Ok, so we're good. Let's reset their password with the new one they submitted.

                                //Hash it
                                _context8.prev = 8;
                                _context8.next = 11;
                                return _bcrypt2.default.hash(ctx.request.body.password, 12);

                            case 11:
                                ctx.request.body.password = _context8.sent;
                                _context8.next = 17;
                                break;

                            case 14:
                                _context8.prev = 14;
                                _context8.t0 = _context8['catch'](8);

                                ctx.throw(400, _context8.t0);

                            case 17:

                                //Make sure to null out the password reset token and expiration on insertion
                                ctx.request.body.passwordResetToken = null;
                                ctx.request.body.passwordResetExpiration = null;
                                _context8.prev = 19;
                                _context8.next = 22;
                                return _db2.default.query('UPDATE koa_vue_notes_users SET ?', ctx.request.body);

                            case 22:
                                result = _context8.sent;
                                _context8.next = 28;
                                break;

                            case 25:
                                _context8.prev = 25;
                                _context8.t1 = _context8['catch'](19);

                                ctx.throw(400, 'INVALID_DATA');

                            case 28:

                                ctx.body = { message: 'SUCCESS' };

                            case 29:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[8, 14], [19, 25]]);
            }));

            function resetPassword(_x8) {
                return _ref8.apply(this, arguments);
            }

            return resetPassword;
        }()
    }, {
        key: 'private',
        value: function () {
            var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(ctx) {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                ctx.body = { user: ctx.state.user };

                            case 1:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function _private(_x9) {
                return _ref9.apply(this, arguments);
            }

            return _private;
        }()

        //Helpers

    }, {
        key: 'generateUniqueToken',
        value: function () {
            var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
                var token;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                token = new _randexp2.default(/[a-zA-Z0-9_-]{7,7}/).gen();
                                _context10.next = 3;
                                return this.checkUniqueToken(token);

                            case 3:
                                if (!_context10.sent) {
                                    _context10.next = 8;
                                    break;
                                }

                                _context10.next = 6;
                                return this.generateUniqueToken();

                            case 6:
                                _context10.next = 9;
                                break;

                            case 8:
                                return _context10.abrupt('return', token);

                            case 9:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function generateUniqueToken() {
                return _ref10.apply(this, arguments);
            }

            return generateUniqueToken;
        }()
    }, {
        key: 'checkUniqueToken',
        value: function () {
            var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(token) {
                var result;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                _context11.next = 2;
                                return _db2.default.query('SELECT COUNT(id) as count FROM koa_vue_notes_users WHERE token = ?', token);

                            case 2:
                                result = _context11.sent;

                                if (!result[0].count) {
                                    _context11.next = 5;
                                    break;
                                }

                                return _context11.abrupt('return', true);

                            case 5:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function checkUniqueToken(_x10) {
                return _ref11.apply(this, arguments);
            }

            return checkUniqueToken;
        }()
    }, {
        key: 'getJwtToken',
        value: function getJwtToken(ctx) {
            if (!ctx.header || !ctx.header.authorization) {
                return;
            }

            var parts = ctx.header.authorization.split(' ');

            if (parts.length === 2) {
                var scheme = parts[0];
                var credentials = parts[1];

                if (/^Bearer$/i.test(scheme)) {
                    return credentials;
                }
            }
            return ctx.throw(401, 'AUTHENTICATION_ERROR');
        }
    }]);

    return UserController;
}();

exports.default = UserController;