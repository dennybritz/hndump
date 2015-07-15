'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var util = require('util');
var events = require('events');
var db = require('./firebase');

// Wait this many milliseconds before we fetch a newly created item.
// If we try fetching immediately after item creation we get back null.
var NEW_ITEM_FETCH_DELAY = 2500;

var ItemWatcher = function() {
  this.maxItem = null;
};
util.inherits(ItemWatcher, events.EventEmitter);

ItemWatcher.prototype.emitItemEvent = function(eventType, itemId, item) {
  this.emit('data', {
    itemId: itemId,
    event: eventType,
    value: item
  });
};

ItemWatcher.prototype.emitItemCreatedEvent = function(itemId, item){
  this.emitItemEvent('item_created', itemId, item);
};

ItemWatcher.prototype.emitItemUpdatedEvent = function(itemId, item){
  this.emitItemEvent('item_updated', itemId, item);
};

ItemWatcher.prototype.fetchNewItem = function(itemId) {
  Promise.delay(NEW_ITEM_FETCH_DELAY)
    .return(itemId)
    .then(this.fetchItemAsync)
    .then(_.partial(this.emitItemCreatedEvent, itemId));
};

ItemWatcher.prototype.fetchItem = function(itemId, callback) {
  db.child('/item/' + itemId).once('value', function(snapshot) {
    callback(null, snapshot.val());
  });
};

ItemWatcher.prototype.updateMaxItem = function(maxItem) {
  var itemsToFetch = this.maxItem ? _.range(this.maxItem + 1, maxItem + 1) : [maxItem];
  this.maxItem = maxItem;
  itemsToFetch.forEach(this.fetchNewItem);
};

ItemWatcher.prototype.start = function() {
  // Watch new items
  db.child('/maxitem').on('value', function(snapshot) {
    this.updateMaxItem(snapshot.val());
  }.bind(this));

  // Watch item updates
  db.child('/updates/items').on('child_added', function(snapshot, prevChildKey) {
    var itemId = snapshot.val();
    this.fetchItemAsync(itemId).then(_.partial(this.emitItemUpdatedEvent, itemId))
  }.bind(this));
};

ItemWatcher.prototype.stop = function() {
  // Stop watching all items
  db.child('/maxitem').off('value');
  db.child('/updates/items').off('child_added');
}

Promise.promisifyAll(ItemWatcher);
Promise.promisifyAll(ItemWatcher.prototype);
module.exports = _.bindAll(new ItemWatcher());
