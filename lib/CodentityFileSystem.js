'use strict';

let _ = require('underscore');
let CodentityCli = require('./CodentityCli');
let FileLoader = require('./helpers/FileLoader');
let FilePath = require('./helpers/FilePath');
let recursive = require('recursive-readdir');

const SPECIAL_FILES = {
  bowerrc: '.bowerrc',
  bowerJson: 'bower.json',
  packageJson: 'package.json',
  gitignore: '.gitignore'
};

class CodentityFileSystem {
  constructor (options) {
    options = options || {};
  }
  getProjectData (baseDirectory) {
    this._setBaseDir(baseDirectory);
    return Promise.all([
      this._getSpecialFileResults(),
      this._getFilePaths()
    ])
    .then((value) => {
      let projectDataItems = value[0].concat(value[1]).concat({
        baseDirectory: this._baseDirectory
      });
      return projectDataItems.reduce(function (obj, fileInfo) {
        return _.extend(obj, fileInfo)
      }, {});
    });
  }
  static getProjectData (baseDirectory) {
    return new CodentityFileSystem().getProjectData(baseDirectory);
  }
  _setBaseDir (baseDirectory) {
    baseDirectory = baseDirectory || process.cwd();
    this._baseDirectory = baseDirectory;
    this._loader = FileLoader.base(baseDirectory);
    this._path = FilePath.base(baseDirectory);
  }
  _getFilePaths () {
    return new Promise((resolve, reject) => {
      recursive(this._baseDirectory, (err, filePaths) => {
        if (err) return reject(err);
        resolve(this._makeFileResultObject('filePaths', filePaths));
      });
    });
  }
  _getSpecialFileResults () {
    let promises = Object.keys(SPECIAL_FILES).map((key) => {
      let filePath = SPECIAL_FILES[key];
      return this._getFileResult(key, filePath);
    });
    return Promise.all(promises);
  }
  _getFileResult (key, filePath) {
    var obj = {};
    return this._getFile(filePath)
    .then((file) => {
      return this._makeFileResultObject(key, file);
    });
  }
  _getFile (filePath) {
    return this._loader.load(filePath).catch((err) => {
      return Promise.resolve();
    });
  }
  _makeFileResultObject (key, data) {
    let obj = {};
    obj[key] = data;
    return obj;
  }
}

module.exports = CodentityFileSystem;
