/* jshint esnext: true */
var _ = require('underscore');
var FilePath = require('../helpers/FilePath');
var minimatch = require('minimatch');

function FileFinder (config) {
  config = config || {};
  this._filePaths = this._getRelativeFilePaths(config.filePaths || []);
  this._baseDirectory = config.baseDirectory || '';
}

FileFinder.make = function (config) {
  return new FileFinder(config);
};

FileFinder.prototype.from = function (filePaths) {
  this._filePaths = this._getRelativeFilePaths(filePaths);
  return this;
};

FileFinder.prototype.find = function (query) {
  return this._filePaths.filter(function (filePath) {
    return this.isMatch(query, filePath);
  }.bind(this));
};

FileFinder.prototype.findFirst = function (query) {
  for (var index in this._filePaths) {
    var filePath = this._filePaths[index];
    if (this.isMatch(query, filePath)) return filePath;
  }
};

FileFinder.prototype.isMatch = function (query, filePath) {
  if (_.isRegExp(query)) return matchRegexp(query, filePath);
  if (_.isString(query)) return matchMinimatch(query, filePath);
};

FileFinder.prototype._getRelativeFilePaths = function (filePaths) {
  return FilePath.base(this._baseDirectory).relative(filePaths || []);
};

function matchRegexp (regexp, filePath) {
  return !!filePath.match(regexp);
}

function matchMinimatch (str, filePath) {
  return minimatch(filePath, str);
}

module.exports = FileFinder;
