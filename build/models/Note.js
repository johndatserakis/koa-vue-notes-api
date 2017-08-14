'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findById = exports.Note = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var findById = function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(id) {
        var noteData;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.prev = 0;
                        _context6.next = 3;
                        return _db2.default.query('\n            SELECT id, userId, title, content\n            FROM koa_vue_notes_notes\n            WHERE id = ?\n            ', [id]);

                    case 3:
                        noteData = _context6.sent;
                        return _context6.abrupt('return', noteData[0]);

                    case 7:
                        _context6.prev = 7;
                        _context6.t0 = _context6['catch'](0);

                        console.log(_context6.t0);
                        throw new Error('ERROR');

                    case 11:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this, [[0, 7]]);
    }));

    return function findById(_x5) {
        return _ref6.apply(this, arguments);
    };
}();

require('dotenv/config');

var _db = require('../db/db');

var _db2 = _interopRequireDefault(_db);

var _randexp = require('randexp');

var _randexp2 = _interopRequireDefault(_randexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Note = function () {
    function Note(data) {
        _classCallCheck(this, Note);

        if (!data) {
            return;
        }

        this.id = data.id;
        this.userId = data.userId;
        this.title = data.title;
        this.content = data.content;
        this.ipAddress = data.ipAddress;
    }

    _createClass(Note, [{
        key: 'all',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(input) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return _db2.default.query('\n                SELECT *\n                FROM koa_vue_notes_notes\n                WHERE userId = ?\n                AND title LIKE CONCAT(\'%\', ?, \'%\')\n                ORDER BY createdAt ' + input.order + '\n                LIMIT ?, ?\n                ', [input.userId, input.sort ? input.sort : '', +input.page * +input.limit, +input.limit]);

                            case 3:
                                return _context.abrupt('return', _context.sent);

                            case 6:
                                _context.prev = 6;
                                _context.t0 = _context['catch'](0);

                                console.log(_context.t0);
                                throw new Error('ERROR');

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 6]]);
            }));

            function all(_x) {
                return _ref.apply(this, arguments);
            }

            return all;
        }()
    }, {
        key: 'find',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(input) {
                var result;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                _context2.next = 3;
                                return findById(input.id);

                            case 3:
                                result = _context2.sent;

                                if (result) {
                                    _context2.next = 6;
                                    break;
                                }

                                return _context2.abrupt('return', {});

                            case 6:
                                this.constructor(result);
                                _context2.next = 13;
                                break;

                            case 9:
                                _context2.prev = 9;
                                _context2.t0 = _context2['catch'](0);

                                console.log(_context2.t0);
                                throw new Error('ERROR');

                            case 13:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 9]]);
            }));

            function find(_x2) {
                return _ref2.apply(this, arguments);
            }

            return find;
        }()
    }, {
        key: 'store',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;
                                _context3.next = 3;
                                return _db2.default.query('INSERT INTO koa_vue_notes_notes SET ?', [this]);

                            case 3:
                                return _context3.abrupt('return', _context3.sent);

                            case 6:
                                _context3.prev = 6;
                                _context3.t0 = _context3['catch'](0);

                                console.log(_context3.t0);
                                throw new Error('ERROR');

                            case 10:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[0, 6]]);
            }));

            function store() {
                return _ref3.apply(this, arguments);
            }

            return store;
        }()
    }, {
        key: 'save',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(input) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                _context4.next = 3;
                                return _db2.default.query('UPDATE koa_vue_notes_notes SET ? WHERE id = ?', [this, this.id]);

                            case 3:
                                _context4.next = 9;
                                break;

                            case 5:
                                _context4.prev = 5;
                                _context4.t0 = _context4['catch'](0);

                                console.log(_context4.t0);
                                throw new Error('ERROR');

                            case 9:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 5]]);
            }));

            function save(_x3) {
                return _ref4.apply(this, arguments);
            }

            return save;
        }()
    }, {
        key: 'destroy',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(input) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;
                                _context5.next = 3;
                                return _db2.default.query('DELETE FROM koa_vue_notes_notes WHERE id = ?', [this.id]);

                            case 3:
                                _context5.next = 9;
                                break;

                            case 5:
                                _context5.prev = 5;
                                _context5.t0 = _context5['catch'](0);

                                console.log(_context5.t0);
                                throw new Error('ERROR');

                            case 9:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 5]]);
            }));

            function destroy(_x4) {
                return _ref5.apply(this, arguments);
            }

            return destroy;
        }()
    }]);

    return Note;
}();

exports.Note = Note;
exports.findById = findById;