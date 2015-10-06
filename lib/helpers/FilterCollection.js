/* jshint esnext: true */
var _ = require('underscore');

function FilterCollection (filters) {
  this._filters = filters || [];
}

FilterCollection.make = function (filters) {
  return new FilterCollection(filters);
};

FilterCollection.prototype.add = function (filter) {
  if (!_.isFunction(filter)) return throwInvalidFilterError();
  this._filters.push(filter);
  return this;
};

FilterCollection.prototype.filter = function (array) {
  return array.filter(function (value) {
    for (var filter of this._filters) {
      if (!filter(value)) return false;
    }
    return true;
  }.bind(this));
};

FilterCollection.prototype.inverseFilter = function (array) {
  return array.filter(function (value) {
    for (var filter of this._filters) {
      if (filter(value)) return false;
    }
    return true;
  }.bind(this));
};

function throwInvalidFilterError () {
  var message = 'Filter must be a function';
  throw new Error(message);
}

module.exports = FilterCollection;
