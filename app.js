'use strict';

var itemWatcher = require('./lib/itemWatcher');
var output = require('./lib/log');

itemWatcher.start();
itemWatcher.on('data', output.info);
