'use strict';

const readdir = require('recursive-readdir');
const request = require('request');
const minimatch = require('minimatch');
const path = require('path');
const fs = require('fs');
const version = require('../../package').version;

class FileSystemPreset {
  constructor (config) {
    config = config || {};
    this._baseDir = config.baseDir;
    this._registryUrl = config.registryUrl;
    this._packages = config.packages;
    this._plugins = config.plugins;
  }
  static make (config) {
    return new FileSystemPreset(config);
  }
  filePaths () {
    return new Promise((resolve, reject) => {
      readdir(this._baseDir, (err, filePaths) => {
        if (err) return reject(err);
        resolve(filePaths.map((filePath) => {
          return path.relative(this._baseDir, filePath);
        }) || []);
      });
    });
  }
  packages () {
    if (this._packages) return this._packages;
    return this._getPackagesFromRegistry();
  }
  provide (query, key, filePaths) {
    for (let filePath in filePaths) {
      if (minimatch(filePath, query)) return this._loadFile(filePath);
    }
    return Promise.resolve();
  }
  _getPackagesFromRegistry () {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: this._registryUrl,
        json: true,
        headers: {
          'x-codentity-version': version
        }
      }, (err, res, body) => {
        if (err) return reject(err);
        if (res.statusCode === 200) return resolve(body);
        let httpErr = new Error(body.message);
        httpErr.status = res.statusCode;
        reject(httpErr);
      });
    });
  }
  _loadFile (filePath) {
    return new Promise((resolve, reject) => {
      const absFilePath = path.resolve(this._baseDir, filePath);
      return fs.readFile(absFilePath, 'utf-8', (err, file) => {
        if (err) return reject(err);
        resolve(file);
      });
    });
  }
}

module.exports = FileSystemPreset;
