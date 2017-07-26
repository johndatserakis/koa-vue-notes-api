'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _UserAction = require('../models/UserAction');

var _UserAction2 = _interopRequireDefault(_UserAction);

var _format = require('date-fns/format');

var _format2 = _interopRequireDefault(_format);

var _jwt = require('../middleware/jwt');

var _jwt2 = _interopRequireDefault(_jwt);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = new _koaRouter2.default();
var jwtMiddleware = (0, _jwt2.default)({ secret: process.env.JWT_SECRET });

router.get('/', function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        ctx.body = { 'message': 'Hi there.' };

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

router.post('/api/v1/user/signup', function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
        var user;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        user = new _UserAction2.default();
                        _context2.next = 3;
                        return user.signup(ctx);

                    case 3:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());

router.post('/api/v1/user/authenticate', function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, next) {
        var user;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        user = new _UserAction2.default();
                        _context3.next = 3;
                        return user.authenticate(ctx);

                    case 3:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}());

router.post('/api/v1/user/refreshAccessToken', function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx, next) {
        var user;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        user = new _UserAction2.default();
                        _context4.next = 3;
                        return user.refreshAccessToken(ctx);

                    case 3:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}());

router.post('/api/v1/user/invalidateAllRefreshTokens', jwtMiddleware, function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx, next) {
        var user;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        user = new _UserAction2.default();
                        _context5.next = 3;
                        return user.invalidateAllRefreshTokens(ctx);

                    case 3:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}());

router.post('/api/v1/user/invalidateRefreshToken', jwtMiddleware, function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(ctx, next) {
        var user;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        user = new _UserAction2.default();
                        _context6.next = 3;
                        return user.invalidateRefreshToken(ctx);

                    case 3:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function (_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}());

router.post('/api/v1/user/forgot', function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(ctx, next) {
        var user;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        user = new _UserAction2.default();
                        _context7.next = 3;
                        return user.forgot(ctx);

                    case 3:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function (_x13, _x14) {
        return _ref7.apply(this, arguments);
    };
}());

router.post('/api/v1/user/checkPasswordResetToken', function () {
    var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(ctx, next) {
        var user;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        user = new _UserAction2.default();
                        _context8.next = 3;
                        return user.checkPasswordResetToken(ctx);

                    case 3:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function (_x15, _x16) {
        return _ref8.apply(this, arguments);
    };
}());

router.post('/api/v1/user/resetPassword', function () {
    var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(ctx, next) {
        var user;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        user = new _UserAction2.default();
                        _context9.next = 3;
                        return user.resetPassword(ctx);

                    case 3:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function (_x17, _x18) {
        return _ref9.apply(this, arguments);
    };
}());

router.post('/api/v1/user/private', jwtMiddleware, function () {
    var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(ctx, next) {
        var user;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        user = new _UserAction2.default();
                        _context10.next = 3;
                        return user.private(ctx);

                    case 3:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, undefined);
    }));

    return function (_x19, _x20) {
        return _ref10.apply(this, arguments);
    };
}());

exports.default = router;