var Path = require('path');
var q = require('q');
var fs = require('fs');

function FileLoader (baseDirectory) {
  this._baseDirectory = baseDirectory;
}

FileLoader.prototype.load = function (relativeFilePath) {
  var filePath = Path.join(this._baseDirectory, relativeFilePath);
  return readFile(filePath);
};

FileLoader.base = function (baseDirectory) {
  return new FileLoader(baseDirectory);
};

function readFile (filePath) {
  var deferred = q.defer();
  fs.readFile(filePath, 'utf-8', function (err, file) {
    if (err) return deferred.reject(err);
    deferred.resolve(file);
  });
  return deferred.promise;
}

module.exports = FileLoader;
