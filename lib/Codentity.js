/* jshint esnext: true */

'use strict';

var FilterCollection = require('./helpers/FilterCollection');
var _ = require('underscore');
var Bower = require('./wrappers/Bower');
var Npm = require('./wrappers/Npm');
var Git = require('./wrappers/Git');
var Fs = require('./wrappers/Fs');

function Codentity (config) {
  this._initAnalysis(config);
  this._initPackages((config || {}).packages);
}

Codentity.prototype._initPackages = function (packages) {
  this._packages = packages || [];
}

Codentity.prototype._initAnalysis = function (config) {
  config = config || {};
  this._config = config;
  this._bower = Bower.make(config);
  this._npm = Npm.make(config);
  this._git = Git.make(config);
  this._sourceFiles = this._getSourceFiles(config.filePaths);
  this._fs = Fs.make({
    filePaths: this._sourceFiles
  });
}

Codentity.prototype.packages = function (packages) {
  // getter
  if (_.isUndefined(packages)) return this._packages;
  // setter
  if (_.isArray(packages)) {
    this._initPackages(packages);
    return this;
  }
  // invalid packages
  throw new Error('Invalid invocation');
};

Codentity.prototype.analyze = function (config) {
  if (_.isObject(config)) this._initAnalysis(config);
  var results = {};
  this._packages.map((pkg) => {
    let matches = this._find(pkg);
    if (matches.length) results[pkg.name.toLowerCase()] = matches;
  });
  return results;
};

Codentity.prototype._getSourceFiles = function (filePaths) {
  var filters = [
    this._npm.createFilter(),
    this._bower.createFilter(),
    this._git.createFilter()
  ];
  var fc = FilterCollection.make(filters);
  return fc.inverseFilter(filePaths || []);
};

Codentity.prototype._find = function (pkg) {
  let bowerMatches = this._findInBowerJson(pkg.bowerJson);
  let npmMatches = this._findInPackageJson(pkg.packageJson);
  let filePathMatches = this._findInFilePaths(pkg.filePath);
  return [].concat(bowerMatches || [])
         .concat(npmMatches || [])
         .concat(filePathMatches || []);
}

Codentity.prototype._findInBowerJson = function (query) {
  if (_.isUndefined(query)) return [];
  if (_.isString(query)) return this._bower.find(query);
  if (_.isArray(query)) {
    let matches = [];
    for (let q of query) {
      let match = this._bower.find(q);
      if (match.length) matches = matches.concat(match);
    }
    return matches;
  }
}

Codentity.prototype._findInPackageJson = function (query) {
  if (_.isUndefined(query)) return [];
  if (_.isString(query)) return this._npm.find(query);
  if (_.isArray(query)) {
    let matches = [];
    for (let q of query) {
      let match = this._npm.find(q);
      if (match.length) matches = matches.concat(match);
    }
    return matches;
  }
}

Codentity.prototype._findInFilePaths = function (query) {
  if (_.isUndefined(query)) return [];
  if (_.isString(query)) return this._fs.find(query);
  if (_.isArray(query)) {
    let matches = [];
    for (let q of query) {
      let match = this._fs.find(q);
      if (match.length) matches = matches.concat(match);
    }
    return matches;
  }
}

module.exports = Codentity;
