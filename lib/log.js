'use strict';

var _ = require('lodash');
var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'hndump',
  streams: [{
    type: 'rotating-file',
    path: process.env.LOGFILE || 'log/hn-events.jsonlines',
    period: '1d',
    count: Number.MAX_VALUE
  }]
});

log.fields = {};
module.exports = _.bindAll(log);
