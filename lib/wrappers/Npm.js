var NpmPackageFinder = require('../finders/NpmPackageFinder');
var NpmFileFilter = require('../filters/NpmFileFilter');

function Npm (config) {
  this.from(config);
}

Npm.make = function (config) {
  return new Npm(config);
};

Npm.prototype.from = function (config) {
  this._finder = NpmPackageFinder.make(config);
  this._filter = NpmFileFilter.make(config);
  return this;
};

Npm.prototype.createFilter = function () {
  return this._filter.createFilter();
};

Npm.prototype.filter = function (filePaths) {
  return this._filter.filter(filePaths);
};

Npm.prototype.uses = function (query) {
  return this._finder.uses(query);
};

Npm.prototype.find = function (query) {
  return this._finder.find(query);
};

Npm.prototype.findFirst = function (query) {
  return this._finder.findFirst(query);
};

module.exports = Npm;
