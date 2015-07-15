'use strict';

var _ = require('lodash');
var itemWatcher = require('./lib/itemWatcher');

itemWatcher.start();
itemWatcher.on('data', _.compose(console.log, JSON.stringify));
