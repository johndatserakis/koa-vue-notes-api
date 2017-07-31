'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _jwt = require('../middleware/jwt');

var _jwt2 = _interopRequireDefault(_jwt);

var _log = require('../log');

var _log2 = _interopRequireDefault(_log);

var _NoteController = require('../controllers/NoteController');

var _NoteController2 = _interopRequireDefault(_NoteController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = new _koaRouter2.default();
var jwtMiddleware = (0, _jwt2.default)({ secret: process.env.JWT_SECRET });

router.get('/api/v1/notes', jwtMiddleware, function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var noteController;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        noteController = new _NoteController2.default();
                        _context.next = 3;
                        return noteController.index(ctx);

                    case 3:
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

router.post('/api/v1/notes', jwtMiddleware, function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
        var noteController;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        noteController = new _NoteController2.default();
                        _context2.next = 3;
                        return noteController.store(ctx);

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

router.get('/api/v1/notes/:id', jwtMiddleware, function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, next) {
        var noteController;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        noteController = new _NoteController2.default();
                        _context3.next = 3;
                        return noteController.show(ctx);

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

router.put('/api/v1/notes/:id', jwtMiddleware, function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx, next) {
        var noteController;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        noteController = new _NoteController2.default();
                        _context4.next = 3;
                        return noteController.update(ctx);

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

router.delete('/api/v1/notes/:id', jwtMiddleware, function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx, next) {
        var noteController;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        noteController = new _NoteController2.default();
                        _context5.next = 3;
                        return noteController.destroy(ctx);

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

exports.default = router;