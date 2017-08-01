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

var _format = require('date-fns/format');

var _format2 = _interopRequireDefault(_format);

var _User = require('../models/User');

var _Note = require('../models/Note');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noteSchema = _joi2.default.object({
    id: _joi2.default.number().integer(),
    userId: _joi2.default.number().integer().required(),
    title: _joi2.default.string().required(),
    content: _joi2.default.string().required(),
    ipAddress: _joi2.default.string()
});

var NoteController = function () {
    function NoteController() {
        _classCallCheck(this, NoteController);
    }

    _createClass(NoteController, [{
        key: 'index',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
                var user, notes;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                user = new _User.User(ctx.state.user[0]);
                                notes = void 0;
                                _context.prev = 2;
                                _context.next = 5;
                                return _db2.default.query('\n                SELECT *\n                FROM koa_vue_notes_notes\n                WHERE userId = ?\n                AND title LIKE CONCAT(\'%\', ?, \'%\')\n                ORDER BY ?\n                LIMIT ?, ?\n                ', [user.id, ctx.query.sort, ctx.query.order, +ctx.query.page * +ctx.query.limit, +ctx.query.limit]);

                            case 5:
                                notes = _context.sent;
                                _context.next = 11;
                                break;

                            case 8:
                                _context.prev = 8;
                                _context.t0 = _context['catch'](2);

                                ctx.throw(400, _context.t0 + 'INVALID_DATA');

                            case 11:

                                ctx.body = notes;

                            case 12:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[2, 8]]);
            }));

            function index(_x) {
                return _ref.apply(this, arguments);
            }

            return index;
        }()
    }, {
        key: 'show',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
                var note;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!ctx.params.id) ctx.throw(400, 'INVALID_DATA');

                                //Get the matching note and make sure it exists
                                _context2.t0 = _Note.Note;
                                _context2.next = 4;
                                return (0, _Note.findById)(ctx.params.id, ctx);

                            case 4:
                                _context2.t1 = _context2.sent;
                                note = new _context2.t0(_context2.t1);

                                if (!note.id) ctx.throw(400, 'INVALID_DATA');

                                ctx.body = note;

                            case 8:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function show(_x2) {
                return _ref2.apply(this, arguments);
            }

            return show;
        }()
    }, {
        key: 'store',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
                var user, note, validator;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                //Attach logged in user
                                user = new _User.User(ctx.state.user[0]);

                                ctx.request.body.userId = user.id;

                                //Add ip
                                ctx.request.body.ipAddress = ctx.ip;

                                //Create a new note object
                                note = new _Note.Note(ctx.request.body);

                                //Validate the newly created note

                                validator = _joi2.default.validate(note, noteSchema);

                                if (validator.error) ctx.throw(400, validator.error.details[0].message);

                                //Actually create the note
                                _context3.prev = 6;
                                _context3.next = 9;
                                return _db2.default.query('INSERT INTO koa_vue_notes_notes SET ?', [note]);

                            case 9:
                                _context3.next = 14;
                                break;

                            case 11:
                                _context3.prev = 11;
                                _context3.t0 = _context3['catch'](6);

                                ctx.throw(400, _context3.t0);

                            case 14:

                                //Respond back with success
                                ctx.body = { message: 'SUCCESS' };

                            case 15:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[6, 11]]);
            }));

            function store(_x3) {
                return _ref3.apply(this, arguments);
            }

            return store;
        }()
    }, {
        key: 'update',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(ctx) {
                var note, user;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!ctx.params.id) ctx.throw(400, 'INVALID_DATA');

                                //Get matching note. Make sure it exists
                                _context4.t0 = _Note.Note;
                                _context4.next = 4;
                                return (0, _Note.findById)(ctx.params.id, ctx);

                            case 4:
                                _context4.t1 = _context4.sent;
                                note = new _context4.t0(_context4.t1);

                                if (!note.id) ctx.throw(400, 'INVALID_DATA');

                                user = new _User.User(ctx.state.user[0]);

                                //Add the updated date value

                                ctx.request.body.updatedAt = (0, _format2.default)(new Date(), 'YYYY-MM-DD HH:mm:ss');

                                //Make sure to match both the note and the user
                                _context4.prev = 9;
                                _context4.next = 12;
                                return _db2.default.query('UPDATE koa_vue_notes_notes SET ? WHERE id = ? AND userId = ?', [ctx.request.body, note.id, user.id]);

                            case 12:
                                _context4.next = 17;
                                break;

                            case 14:
                                _context4.prev = 14;
                                _context4.t2 = _context4['catch'](9);

                                ctx.throw(400, _context4.t2);

                            case 17:

                                //Respond back with success
                                ctx.body = { message: 'SUCCESS' };

                            case 18:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[9, 14]]);
            }));

            function update(_x4) {
                return _ref4.apply(this, arguments);
            }

            return update;
        }()
    }, {
        key: 'destroy',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx) {
                var note, user;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!ctx.params.id) ctx.throw(400, 'INVALID_DATA');

                                //Get matching note. Make sure it exists
                                _context5.t0 = _Note.Note;
                                _context5.next = 4;
                                return (0, _Note.findById)(ctx.params.id, ctx);

                            case 4:
                                _context5.t1 = _context5.sent;
                                note = new _context5.t0(_context5.t1);

                                if (!note.id) ctx.throw(400, 'INVALID_DATA');

                                user = new _User.User(ctx.state.user[0]);

                                //Make sure to match both the note and the user

                                _context5.prev = 8;
                                _context5.next = 11;
                                return _db2.default.query('DELETE FROM koa_vue_notes_notes WHERE id = ? AND userId = ?', [note.id, user.id]);

                            case 11:
                                _context5.next = 16;
                                break;

                            case 13:
                                _context5.prev = 13;
                                _context5.t2 = _context5['catch'](8);

                                ctx.throw(400, _context5.t2);

                            case 16:

                                //Respond back with success
                                ctx.body = { message: 'SUCCESS' };

                            case 17:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[8, 13]]);
            }));

            function destroy(_x5) {
                return _ref5.apply(this, arguments);
            }

            return destroy;
        }()
    }]);

    return NoteController;
}();

exports.default = NoteController;