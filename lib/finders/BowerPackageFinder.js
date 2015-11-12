/* jshint esnext: true */

var _ = require('underscore'),
    JsonPackageFinder = require('../helpers/JsonPackageFinder');

var DEPENDENCY_PATHS = [
  'dependencies',
  'devDependencies'
];

function BowerPackageFinder (config) {
  config = config || {};
  this._src = 'bowerJson';
  this._finder = new JsonPackageFinder({
    json: this._parseBowerJson(config.bowerJson),
    dependencyPaths: DEPENDENCY_PATHS
  });
}

BowerPackageFinder.make = function (config) {
  return new BowerPackageFinder(config);
};

BowerPackageFinder.prototype.uses = function (query) {
  return this._finder.uses(query);
};

BowerPackageFinder.prototype.from = function (rawBowerJson) {
  this._finder.from(parseBowerJson(rawBowerJson));
  return this;
};

BowerPackageFinder.prototype.find = function (query) {
  return this._finder.find(query).map(this._getCleanResult.bind(this));
};

BowerPackageFinder.prototype.findFirst = function (query) {
  var match = this._finder.findFirst(query);
  if (match) return this._getCleanResult(match);
};

BowerPackageFinder.prototype._parseBowerJson = function (rawBowerJson) {
  if (rawBowerJson === undefined) return;
  if (_.isString(rawBowerJson)) return JSON.parse(rawBowerJson);
  if (_.isObject(rawBowerJson)) return rawBowerJson;
  throw new Error('Invalid `bowerJson`');
};

BowerPackageFinder.prototype._getCleanResult = function (result) {
  return {
    src: this._src,
    version: result.value,
    dependencyGroup: result.path,
    packageName: result.key
  };
};

module.exports = BowerPackageFinder;
// 
// 'use strict';
//
// const JsonPackageFinder = require('../helpers/JsonPackageFinder');
// const _ = require('underscore');
//
//
// const DEPENDENCY_PATHS = [
//   'dependencies',
//   'devDependencies'
// ];
//
// class BowerPackageFinder extends JsonPackageFinder {
//   constructor (config) {
//     super({
//       json: config.json,
//       dependencyPaths: DEPENDENCY_PATHS
//     });
//     this._src = 'bowerJson';
//   }
//   static make (config) {
//     return new BowerPackageFinder(config);
//   }
//   from (rawBowerJson) {
//     let bowerJson = this._parseBowerJson(rawBowerJson);
//     super.from(bowerJson);
//     return this;
//   }
//   find (query) {
//     let result = super.find(query);
//     return result.map(this._getCleanResult.bind(this));
//   }
//   findFirst (query) {
//     let match = super.findFirst(query);
//     if (match) return this._getCleanResult(match);
//   }
//   _parseBowerJson (rawBowerJson) {
//     if (rawBowerJson === undefined) return;
//     if (_.isString(rawBowerJson)) return JSON.parse(rawBowerJson);
//     if (_.isObject(rawBowerJson)) return rawBowerJson;
//     throw new Error('Invalid `bowerJson`');
//   }
//   _getCleanResult (result) {
//     return {
//       src: this._src,
//       version: result.value,
//       dependencyGroup: result.path,
//       packageName: result.key
//     };
//   }
// }
//
// module.exports = BowerPackageFinder;
