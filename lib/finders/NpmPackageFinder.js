/* jshint esnext: true */

var _ = require('underscore'),
    JsonPackageFinder = require('../helpers/JsonPackageFinder');

var DEPENDENCY_PATHS = [
  'dependencies',
  'devDependencies'
];

function NpmPackageFinder (config) {
  config = config || {};
  this._src = 'packageJson';
  this._finder = new JsonPackageFinder({
    json: this._parsePackageJson(config.packageJson),
    dependencyPaths: DEPENDENCY_PATHS
  });
}

NpmPackageFinder.make = function (config) {
  return new NpmPackageFinder(config);
};

NpmPackageFinder.prototype.uses = function (query) {
  return this._finder.uses(query);
};

NpmPackageFinder.prototype.from = function (rawPackageJson) {
  this._finder.from(parsePackageJson(rawPackageJson));
  return this;
};

NpmPackageFinder.prototype.find = function (query) {
  return this._finder.find(query).map(this._getCleanResult.bind(this));
};

NpmPackageFinder.prototype.findFirst = function (query) {
  var match = this._finder.findFirst(query);
  if (match) return this._getCleanResult(match);
};

NpmPackageFinder.prototype._parsePackageJson = function (rawPackageJson) {
  if (rawPackageJson === undefined) return;
  if (_.isString(rawPackageJson)) return JSON.parse(rawPackageJson);
  if (_.isObject(rawPackageJson)) return rawPackageJson;
  throw new Error('Invalid `packageJson`');
};

NpmPackageFinder.prototype._getCleanResult = function (result) {
  return {
    src: this._src,
    version: result.value,
    dependencyGroup: result.path,
    packageName: result.key
  };
};

module.exports = NpmPackageFinder;
