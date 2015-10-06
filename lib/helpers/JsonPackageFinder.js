/* jshint esnext: true */

var _ = require('underscore'),
    ObjectPath = require('object-path'),
    KeyFinder = require('../helpers/KeyFinder');

function JsonPackageFinder (config) {
  config = config || {};
  this._json = config.json;
  this._dependencyPaths = config.dependencyPaths;
}

JsonPackageFinder.make = function (config) {
  return new JsonPackageFinder(config);
};

JsonPackageFinder.prototype.uses = function (query) {
  for (var dependencyPath of this._dependencyPaths) {
    var dependencyGroup = ObjectPath.get(this._json, dependencyPath);
    if (dependencyGroup) {
      var finder = new KeyFinder(dependencyGroup);
      if (finder.findFirst(query)) return true;
    }
  }
  return false;
};

JsonPackageFinder.prototype.from = function (json) {
  this._json = json;
  return this;
};

JsonPackageFinder.prototype.find = function (query) {
  var packages = [];
  for (var dependencyPath of this._dependencyPaths) {
    var matches = this._findInPath(query, dependencyPath);
    if (matches) packages = packages.concat(matches);
  }
  return packages;
};

JsonPackageFinder.prototype.findFirst = function (query) {
  for (var dependencyPath of this._dependencyPaths) {
    var match = this._findFirstInPath(query, dependencyPath);
    if (match) return match;
  }
};

JsonPackageFinder.prototype._getDependencyGroup = function (path) {
  return ObjectPath.get(this._json, path);
};

JsonPackageFinder.prototype._findInPath = function (query, path) {
  var dependencyGroup = this._getDependencyGroup(path);
  if (dependencyGroup) {
    var finder = new KeyFinder(dependencyGroup);
    var matches = finder.find(query);
    return matches.map(function (match) {
      return this._getResult(path, match);
    }.bind(this));
  }
};

JsonPackageFinder.prototype._findFirstInPath = function (query, path) {
  var dependencyGroup = this._getDependencyGroup(path);
  if (dependencyGroup) {
    var finder = new KeyFinder(dependencyGroup);
    var match = finder.findFirst(query);
    if (match) return this._getResult(path, match);
  }
};

JsonPackageFinder.prototype._getResult = function (path, match) {
  return {
    path: path,
    key: match.key,
    value: match.value
  };
};

function throwError (message) {
  throw new Error(message);
}

module.exports = JsonPackageFinder;
