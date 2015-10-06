var GitFileFilter = require('../filters/GitignoreFileFilter');

function Git (config) {
  this.from(config);
}

Git.make = function (config) {
  return new Git(config);
};

Git.prototype.from = function (config) {
  this._filter = GitFileFilter.make(config);
  return this;
};

Git.prototype.createFilter = function () {
  return this._filter.createFilter();
};

Git.prototype.filter = function (filePaths) {
  return this._filter.filter(filePaths);
};

module.exports = Git;
