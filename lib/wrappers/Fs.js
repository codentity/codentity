var FileFinder = require('../finders/FileFinder');

function Fs (config) {
  this._finder = FileFinder.make(config);
}

Fs.make = function (config) {
  return new Fs(config);
};

Fs.prototype.find = function (query) {
  var filePaths = this._finder.find(query);
  if (filePaths) return filePaths.map(this._mapToResult.bind(this));
};

Fs.prototype.findFirst = function (query) {
  var filePath = this._finder.findFirst(query);
  if (filePath) return this._mapToResult(filePath);
};

Fs.prototype.isMatch = function (query) {
  return this._finder.isMatch(query);
};

Fs.prototype._mapToResult = function (filePath) {
  return {
    src: 'file',
    filePath: filePath
  };
};

module.exports = Fs;
