var path = require('path');

function BowerFileFilter (config) {
  config = config || {};
  this._bowerrc = this._parseBowerrc(config.bowerrc);
}

BowerFileFilter.make = function (config) {
  return new BowerFileFilter(config);
};

BowerFileFilter.prototype._parseBowerrc = function (rawBowerrc) {
  if (rawBowerrc === undefined) return;
  if (typeof rawBowerrc === 'string') return JSON.parse(rawBowerrc);
  if (typeof rawBowerrc === 'object') return rawBowerrc;
  throwError('Invalid .bowerrc');
};

BowerFileFilter.prototype._getBowerDirectory = function () {
  if (this._bowerrc && this._bowerrc.directory) {
    return path.normalize(this._bowerrc.directory);
  }
  return "bower_components";
};

BowerFileFilter.prototype.createFilter = function () {
  var bowerDirectory = this._getBowerDirectory();
  return function (filePath) {
    // NOTE this will over-identify e.g. bower_components_alt
    return (filePath.indexOf(bowerDirectory) === 0);
  };
};

BowerFileFilter.prototype.filter = function (filePaths) {
  var filter = this.createFilter();
  return filePaths.filter(filter);
};

function throwError (message) {
  throw new Error(message);
}

module.exports = BowerFileFilter;
