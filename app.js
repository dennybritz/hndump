'use strict';

var _ = require('lodash');
var itemDumper = require('./lib/itemDumper');

itemDumper.start();
itemDumper.on('data', _.compose(console.log, JSON.stringify));
