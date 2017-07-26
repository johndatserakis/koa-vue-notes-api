'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('dotenv/config');

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_log4js2.default.configure({
    appenders: {
        file: {
            type: 'file',
            filename: 'logs/main.log',
            maxLogSize: 20480,
            backups: 10
        },
        console: {
            type: 'stdout'
        }
    },
    categories: {
        development: {
            appenders: ['file', 'console'],
            level: 'all'
        },
        production: {
            appenders: ['file'],
            level: 'info'
        },
        default: {
            appenders: ['file'],
            level: 'info'
        }
    }
});
var logger = process.env.NODE_ENV === 'development' ? _log4js2.default.getLogger('development') : _log4js2.default.getLogger('production');

exports.default = logger;