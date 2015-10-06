var BowerPackageFinder = require('../finders/BowerPackageFinder');
var BowerFileFilter = require('../filters/BowerFileFilter');

function Bower (config) {
  this.from(config);
}

Bower.make = function (config) {
  return new Bower(config);
};

Bower.prototype.from = function (config) {
  this._finder = BowerPackageFinder.make(config);
  this._filter = BowerFileFilter.make(config);
  return this;
};

Bower.prototype.createFilter = function () {
  return this._filter.createFilter();
};

Bower.prototype.filter = function (filePaths) {
  return this._filter.filter(filePaths);
};

Bower.prototype.uses = function (query) {
  return this._finder.uses(query);
};

Bower.prototype.find = function (query) {
  return this._finder.find(query);
};

Bower.prototype.findFirst = function (query) {
  return this._finder.findFirst(query);
};

module.exports = Bower;
