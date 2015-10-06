/* jshint esnext: true */
var _ = require('underscore');
var minimatch = require('minimatch');

function KeyFinder (obj) {
  this.obj = obj;
}

KeyFinder.prototype.find = function (query) {
  if (_.isRegExp(query)) return this.findByRegExp(query);
  if (_.isString(query)) return this.findByString(query);
  throw new Error('`query` must be either RegExp or String');
};

KeyFinder.prototype.findFirst = function (query) {
  if (_.isRegExp(query)) return this.findFirstByRegExp(query);
  if (_.isString(query)) return this.findFirstByString(query);
  throw new Error('`query` must be either RegExp or String');
};

KeyFinder.prototype.findByString = function (str) {
  return this.getMatchesForQuery(function (key) {
    return minimatch(key, str);
  });
};

KeyFinder.prototype.findByRegExp = function (regexp) {
  return this.getMatchesForQuery(function (key) {
    return key.match(regexp);
  });
};

KeyFinder.prototype.findFirstByString = function (str) {
  return this.getFirstMatchForQuery(function (key) {
    return str === key;
  });
};

KeyFinder.prototype.findFirstByRegExp = function (regexp) {
  return this.getFirstMatchForQuery(function (key) {
    return key.match(regexp);
  });
};

KeyFinder.prototype.getMatchesForQuery = function (checkFn) {
  var matches = [];
  for (var key of Object.keys(this.obj)) {
    if (checkFn(key)) matches.push(this.getResultForKey(key));
  }
  return matches;
};

KeyFinder.prototype.getFirstMatchForQuery = function (checkFn) {
  for (var key of Object.keys(this.obj)) {
    if (checkFn(key)) return this.getResultForKey(key);
  }
};

KeyFinder.prototype.getResultForKey = function (key) {
  return {
    key: key,
    value: this.getValue(key)
  };
};

KeyFinder.prototype.getValue = function (key) {
  return this.obj[key];
};

module.exports = KeyFinder;
