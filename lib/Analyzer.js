'use strict';

var _ = require('underscore');
var Bower = require('./wrappers/Bower');
var Npm = require('./wrappers/Npm');
var Git = require('./wrappers/Git');
var Fs = require('./wrappers/Fs');
var FilterCollection = require('./helpers/FilterCollection');

class Analyzer {
  constructor (config) {
    config = config || {};
    this._packages = config.packages || [];
  }
  analyze (projectData) {
    this._bower = Bower.make(projectData);
    this._npm = Npm.make(projectData);
    this._git = Git.make(projectData);
    this._fs = Fs.make({
      filePaths: this._getSourceFiles(projectData.filePaths)
    });
    return this._getResults(this._packages);
  }
  _getResults (packages) {
    var results = {};
    packages.map((pkg) => {
      let matches = this._find(pkg);
      if (matches.length) results[pkg.id] = matches;
    });
    return results;
  }
  _getSourceFiles (filePaths) {
    var filters = this._getFilters();
    var fc = FilterCollection.make(filters);
    return fc.inverseFilter(filePaths || []);
  };
  _getFilters () {
    return [
      this._npm.createFilter(),
      this._bower.createFilter(),
      this._git.createFilter()
    ];
  }
  _find (pkg) {
    const FINDERS = {
      bowerJson: this._bower,
      packageJson: this._npm,
      filePath: this._fs
    };
    return Object.keys(FINDERS).reduce((results, key) => {
      let query = pkg[key];
      let finder = FINDERS[key];
      let matches = this._findInWrapper(finder, query);
      return results.concat(matches);
    }, []);
  }
  _findInWrapper (finder, query) {
    if (_.isUndefined(query)) return [];
    if (_.isString(query)) return finder.find(query);
    if (_.isArray(query)) {
      let matches = [];
      for (let q of query) {
        let match = finder.find(q);
        if (match.length) matches = matches.concat(match);
      }
      return matches;
    }
  }
}

module.exports = Analyzer;
