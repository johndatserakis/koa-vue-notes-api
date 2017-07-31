'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findById = exports.Note = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var findById = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(id, ctx) {
        var noteData;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return _db2.default.query('\n            SELECT id, userId, title, content\n            FROM koa_vue_notes_notes\n            WHERE id = ?\n            ', [id]);

                    case 3:
                        noteData = _context2.sent;
                        return _context2.abrupt('return', noteData[0]);

                    case 7:
                        _context2.prev = 7;
                        _context2.t0 = _context2['catch'](0);

                        ctx.throw(500, 'SERVER_ERROR');

                    case 10:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 7]]);
    }));

    return function findById(_x, _x2) {
        return _ref2.apply(this, arguments);
    };
}();

require('dotenv/config');

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Note = function () {
    function Note(data) {
        _classCallCheck(this, Note);

        if (!data) return;

        this.data = {
            id: data.id,
            userId: data.userId,
            title: data.title,
            content: data.content,
            ipAddress: data.ipAddress
        };
    }

    _createClass(Note, [{
        key: 'save',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return _db2.default.query('INSERT INTO koa_vue_notes_notes SET ?', [this.data]);

                            case 3:
                                _context.next = 8;
                                break;

                            case 5:
                                _context.prev = 5;
                                _context.t0 = _context['catch'](0);

                                ctx.throw(400, _context.t0);

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 5]]);
            }));

            function save() {
                return _ref.apply(this, arguments);
            }

            return save;
        }()
    }]);

    return Note;
}();

exports.Note = Note;
exports.findById = findById;