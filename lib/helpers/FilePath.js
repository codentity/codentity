var Path = require('path');

function FilePath (config) {
  this._baseDirectory = config.baseDirectory || "";
}

FilePath.prototype.relative = function (absFilePath) {
  if (absFilePath instanceof Array) return this._relativeMany(absFilePath);
  return this._relativeOne(absFilePath);
};

FilePath.prototype._relativeMany = function (absFilePaths) {
  return absFilePaths.map(this._relativeOne.bind(this));
};

FilePath.prototype._relativeOne = function (absFilePath) {
  return Path.relative(this._baseDirectory, absFilePath);
};

FilePath.prototype.absolute = function (relFilePath) {
  if (relFilePath instanceof Array) return this._absoluteMany(relFilePath);
  return this._absoluteOne(relFilePath);
};

FilePath.prototype._absoluteMany = function (relFilePaths) {
  return relFilePaths.map(this._absoluteOne.bind(this));
};

FilePath.prototype._absoluteOne = function (relFilePath) {
  return Path.join(this._baseDirectory, relFilePath);
};

FilePath.base = function (baseDirectory) {
  return new FilePath({ baseDirectory: baseDirectory });
};

module.exports = FilePath;
