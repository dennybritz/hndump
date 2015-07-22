'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var util = require('util');
var events = require('events');
var db = require('./firebase');

// Delay between fetches
var FETCH_DELAY = process.env.FETCH_DELAY || 0;
// Fetch this many items at once
var PARALLELISM = process.env.PARALLELISM || 100;
var FETCH_TIMEOUT = 10000;

var ItemDumper = function() {
  this.maxItem = null;
};
util.inherits(ItemDumper, events.EventEmitter);

ItemDumper.prototype.emitItemEvent = function(item) {
  this.emit('data', item);
};


ItemDumper.prototype.fetchItem = function(itemId, callback) {
  db.child('/item/' + itemId).once('value', function(snapshot) {
    callback(null, snapshot.val());
  });
};

ItemDumper.prototype.start = function() {
  //var itemHandler = _.flow(this.fetchItemAsync, this.emitItemEvent);
  var _this = this;
  // Get the maxItem
  Promise.fromNode(function(cb){
    db.child('/maxitem').on('value', function(snapshot) {
      cb(null, snapshot.val());
    }.bind(this));
  }).then(function(maxItem){
    var allItems = _.range(0, maxItem).reverse();
    return _.chunk(allItems, PARALLELISM);
  }).each(function(chunk){
    var fetchPromises = _.map(chunk, function(x) { return _this.fetchItemAsync(x) });
    return Promise.all(fetchPromises)
      .each(_this.emitItemEvent)
      .delay(FETCH_DELAY)
      .timeout(FETCH_TIMEOUT)
      .catch(function(err){
        console.error(err);
      });
  }).catch(function(err){
    console.error(err);
    process.exit(1);
  });
};

ItemDumper.prototype.stop = function() {
  // Stop watching all items
  db.child('/maxitem').off('value');
  db.child('/updates/items').off('child_added');
}

Promise.promisifyAll(ItemDumper);
Promise.promisifyAll(ItemDumper.prototype);
module.exports = _.bindAll(new ItemDumper());
