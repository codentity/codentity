var _ = require('underscore');
var Ignore = require('ignore');

function GitignoreFileFilter (config) {
  config = config || {};
  this._gitignore = this._parseGitignore(config.gitignore);
}

GitignoreFileFilter.make = function (config) {
  return new GitignoreFileFilter(config);
};

GitignoreFileFilter.prototype._parseGitignore = function (gitignore) {
  if (_.isUndefined(gitignore)) return []; // TODO should this throw an error?
  if (_.isArray(gitignore)) return gitignore;
  if (_.isString(gitignore)) return gitignore.split(/[\n,\r]+/g);
};

GitignoreFileFilter.prototype.createFilter = function () {
  var ignore = Ignore().addPattern(this._gitignore.filter(notEmpty));
  var inverseFilter = ignore.createFilter();
  return function (value) {
    return !inverseFilter(value);
  };
};

GitignoreFileFilter.prototype.filter = function (filePaths) {
  var filter = this.createFilter();
  return filePaths.filter(filter);
};

function notEmpty (value) {
  return !!value.trim();
}

module.exports = GitignoreFileFilter;
