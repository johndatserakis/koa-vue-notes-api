'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _kcors = require('kcors');

var _kcors2 = _interopRequireDefault(_kcors);

require('dotenv/config');

var _log = require('./logs/log');

var _log2 = _interopRequireDefault(_log);

var _koaUseragent = require('koa-useragent');

var _koaUseragent2 = _interopRequireDefault(_koaUseragent);

var _koaJsonError = require('koa-json-error');

var _koaJsonError2 = _interopRequireDefault(_koaJsonError);

var _koaRatelimit = require('koa-ratelimit');

var _koaRatelimit2 = _interopRequireDefault(_koaRatelimit);

var _ioredis = require('ioredis');

var _ioredis2 = _interopRequireDefault(_ioredis);

var _userActions = require('./routes/userActions');

var _userActions2 = _interopRequireDefault(_userActions);

var _notes = require('./routes/notes');

var _notes2 = _interopRequireDefault(_notes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//Routes


//Initialize app
var app = new _koa2.default();

//Here's the rate limiter
app.use((0, _koaRatelimit2.default)({
    db: new _ioredis2.default(),
    duration: 60000,
    errorMessage: "Hmm, you seem to be doing that a bit too much - wouldn't you say?",
    id: function id(ctx) {
        return ctx.ip;
    },
    headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total'
    },
    max: 100
}));

//Let's log each successful interaction. We'll also log each error - but not here,
//that's be done in the json error-handling middleware
app.use(function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return next();

                    case 3:
                        _log2.default.info(ctx.method + ' ' + ctx.url + ' RESPONSE: ' + ctx.response.status);
                        _context.next = 8;
                        break;

                    case 6:
                        _context.prev = 6;
                        _context.t0 = _context['catch'](0);

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 6]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

//Apply error json handling
var errorOptions = {
    postFormat: function postFormat(e, obj) {
        //Here's where we'll stick our error logger.
        _log2.default.info(obj);
        if (process.env.NODE_ENV !== 'production') {
            return obj;
        } else {
            delete obj.stack;
            delete obj.name;
            return obj;
        }
    }
};
app.use((0, _koaJsonError2.default)(errorOptions));

// return response time in X-Response-Time header
app.use(function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
        var t1, t2;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        t1 = Date.now();
                        _context2.next = 3;
                        return next();

                    case 3:
                        t2 = Date.now();

                        ctx.set('X-Response-Time', Math.ceil(t2 - t1) + 'ms');

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    function responseTime(_x3, _x4) {
        return _ref2.apply(this, arguments);
    }

    return responseTime;
}());

//For cors
app.use((0, _kcors2.default)());

//For useragent detection
app.use(_koaUseragent2.default);

//For managing body. We're only allowing json.
app.use((0, _koaBodyparser2.default)({ enableTypes: ['json'] }));

//For router
app.use(_userActions2.default.routes());
app.use(_userActions2.default.allowedMethods());
app.use(_notes2.default.routes());
app.use(_notes2.default.allowedMethods());

exports.default = app;