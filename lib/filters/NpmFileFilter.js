var path = require('path');

function NpmFileFilter (config) {
  // ...
}

NpmFileFilter.make = function (config) {
  return new NpmFileFilter(config);
};

NpmFileFilter.prototype._getNodeModulesDirectory = function () {
  // NOTE: https://github.com/npm/npm/issues/3597
  return "node_modules";
};

NpmFileFilter.prototype.createFilter = function () {
  var nodeModulesDir = this._getNodeModulesDirectory();
  return function (filePath) {
    return (filePath.indexOf(nodeModulesDir) === 0);
  };
};

NpmFileFilter.prototype.filter = function (filePaths) {
  var filter = this.createFilter();
  return filePaths.filter(filter);
};

function throwError (message) {
  throw new Error(message);
}

module.exports = NpmFileFilter;
