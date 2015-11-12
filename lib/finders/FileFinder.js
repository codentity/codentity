'use strict';

const FilePath = require('../helpers/FilePath');
const minimatch = require('minimatch');

class FileFinder {
  constructor (config) {
    config = config || {};
    this._filePaths = this._getRelativeFilePaths(config.filePaths || []);
    this._baseDirectory = config.baseDirectory || '';
  }
  static make (config) {
    return new FileFinder(config);
  }
  from (filePaths) {
    this._filePaths = this._getRelativeFilePaths(filePaths);
    return this;
  }
  find (query) {
    return this._filePaths.filter(function (filePath) {
      return this.isMatch(query, filePath);
    }.bind(this));
  }
  findFirst (query) {
    for (let filePath of this._filePaths) {
      if (this.isMatch(query, filePath)) return filePath;
    }
  }
  isMatch (query, filePath) {
    return minimatch(filePath, query);
  }
  _getRelativeFilePaths (filePaths) {
    return FilePath.base(this._baseDirectory).relative(filePaths || []);
  }

}

module.exports = FileFinder;
