'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('dotenv/config');

var _db = require('../db/db');

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
                var user, note, result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                //Attach logged in user
                                user = new _User.User(ctx.state.user[0]);

                                ctx.query.userId = user.id;

                                //Init a new note object
                                note = new _Note.Note();

                                //Let's check that the sort options were set. Sort can be empty

                                if (!ctx.query.order || !ctx.query.page || !ctx.query.limit) {
                                    ctx.throw(400, 'INVALID_ROUTE_OPTIONS');
                                }

                                _context.prev = 4;
                                _context.next = 7;
                                return note.all(ctx.query);

                            case 7:
                                result = _context.sent;

                                ctx.body = result;
                                _context.next = 15;
                                break;

                            case 11:
                                _context.prev = 11;
                                _context.t0 = _context['catch'](4);

                                console.log(_context.t0);
                                ctx.throw(400, 'INVALID_DATA');

                            case 15:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[4, 11]]);
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
                                //Make sure they've chosen an id to show
                                if (!ctx.params.id) ctx.throw(400, 'INVALID_DATA');

                                //Initialize note
                                note = new _Note.Note();
                                _context2.prev = 2;
                                _context2.next = 5;
                                return note.find(ctx.params);

                            case 5:
                                ctx.body = note;
                                _context2.next = 12;
                                break;

                            case 8:
                                _context2.prev = 8;
                                _context2.t0 = _context2['catch'](2);

                                console.log(_context2.t0);
                                ctx.throw(400, 'INVALID_DATA');

                            case 12:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[2, 8]]);
            }));

            function show(_x2) {
                return _ref2.apply(this, arguments);
            }

            return show;
        }()
    }, {
        key: 'create',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx) {
                var user, note, validator, result;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                //Attach logged in user
                                user = new _User.User(ctx.state.user[0]);

                                ctx.request.body.userId = user.id;

                                //Add ip
                                ctx.request.body.ipAddress = ctx.ip;

                                //Create a new note object using the request params
                                note = new _Note.Note(ctx.request.body);

                                //Validate the newly created note

                                validator = _joi2.default.validate(note, noteSchema);

                                if (validator.error) ctx.throw(400, validator.error.details[0].message);

                                _context3.prev = 6;
                                _context3.next = 9;
                                return note.store();

                            case 9:
                                result = _context3.sent;

                                ctx.body = { message: 'SUCCESS', id: result.insertId };
                                _context3.next = 17;
                                break;

                            case 13:
                                _context3.prev = 13;
                                _context3.t0 = _context3['catch'](6);

                                console.log(_context3.t0);
                                ctx.throw(400, 'INVALID_DATA');

                            case 17:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[6, 13]]);
            }));

            function create(_x3) {
                return _ref3.apply(this, arguments);
            }

            return create;
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
                                //Make sure they've specified a note
                                if (!ctx.params.id) ctx.throw(400, 'INVALID_DATA');

                                //Find that note
                                note = new _Note.Note();
                                _context4.next = 4;
                                return note.find(ctx.params);

                            case 4:
                                if (!note) ctx.throw(400, 'INVALID_DATA');

                                //Grab the user //If it's not their note - error out
                                user = new _User.User(ctx.state.user[0]);

                                if (note.userId !== user.id) ctx.throw(400, 'INVALID_DATA');

                                //Add the updated date value
                                note.updatedAt = (0, _format2.default)(new Date(), 'YYYY-MM-DD HH:mm:ss');

                                //Add the ip
                                ctx.request.body.ipAddress = ctx.ip;

                                //Replace the note data with the new updated note data
                                Object.keys(ctx.request.body).forEach(function (parameter, index) {
                                    note[parameter] = ctx.request.body[parameter];
                                });

                                _context4.prev = 10;
                                _context4.next = 13;
                                return note.save();

                            case 13:
                                ctx.body = { message: 'SUCCESS' };
                                _context4.next = 20;
                                break;

                            case 16:
                                _context4.prev = 16;
                                _context4.t0 = _context4['catch'](10);

                                console.log(_context4.t0);
                                ctx.throw(400, 'INVALID_DATA');

                            case 20:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[10, 16]]);
            }));

            function update(_x4) {
                return _ref4.apply(this, arguments);
            }

            return update;
        }()
    }, {
        key: 'delete',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx) {
                var note, user;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (!ctx.params.id) ctx.throw(400, 'INVALID_DATA');

                                //Find that note
                                note = new _Note.Note();
                                _context5.next = 4;
                                return note.find(ctx.params);

                            case 4:
                                if (!note) ctx.throw(400, 'INVALID_DATA');

                                //Grab the user //If it's not their note - error out
                                user = new _User.User(ctx.state.user[0]);

                                if (note.userId !== user.id) ctx.throw(400, 'INVALID_DATA');

                                _context5.prev = 7;
                                _context5.next = 10;
                                return note.destroy();

                            case 10:
                                ctx.body = { message: 'SUCCESS' };
                                _context5.next = 17;
                                break;

                            case 13:
                                _context5.prev = 13;
                                _context5.t0 = _context5['catch'](7);

                                console.log(_context5.t0);
                                ctx.throw(400, 'INVALID_DATA');

                            case 17:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[7, 13]]);
            }));

            function _delete(_x5) {
                return _ref5.apply(this, arguments);
            }

            return _delete;
        }()
    }]);

    return NoteController;
}();

exports.default = NoteController;