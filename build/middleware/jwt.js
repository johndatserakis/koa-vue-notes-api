'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = function () {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var secret = opts.secret;

    var middleware = function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
            var token, decoded;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            //If there's no secret set, toss it out right away
                            if (!secret) ctx.throw(401, 'INVALID_SECRET');

                            //Grab the token
                            token = getJwtToken(ctx);
                            _context.prev = 2;
                            _context.next = 5;
                            return _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET);

                        case 5:
                            decoded = _context.sent;


                            //If it worked set the ctx.state.user parameter to the decoded token.
                            ctx.state.user = decoded.data;
                            _context.next = 12;
                            break;

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context['catch'](2);

                            //If it's an expiration error, let's report that specifically.
                            if (_context.t0.name === 'TokenExpiredError') {
                                ctx.throw(401, 'TOKEN_EXPIRED');
                            } else {
                                ctx.throw(401, 'AUTHENTICATION_ERROR');
                            }

                        case 12:
                            return _context.abrupt('return', next());

                        case 13:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[2, 9]]);
        }));

        function jwt(_x2, _x3) {
            return _ref.apply(this, arguments);
        }

        return jwt;
    }();

    function getJwtToken(ctx) {
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

    return middleware;
};