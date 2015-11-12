'use strict';

const Ignore = require('ignore');
const _ = require('underscore');

class GitignoreFileFilter {
  constructor (config) {
    config = config || {};
    this._gitignore = this._parseGitignore(config.gitignore);
  }
  static make (config) {
    return new GitignoreFileFilter(config);
  }
  filter (filePaths) {
    var filter = this.createFilter();
    return filePaths.filter(filter);
  }
  createFilter () {
    let pattern = this._gitignore.filter(this._notEmpty.bind(this));
    var ignore = new Ignore().addPattern(pattern);
    var inverseFilter = ignore.createFilter();
    return function (value) {
      return !inverseFilter(value);
    };
  }
  _parseGitignore (gitignore) {
    if (_.isUndefined(gitignore)) return [];
    if (_.isArray(gitignore)) return gitignore;
    if (_.isString(gitignore)) return gitignore.split(/[\n,\r]+/g);
  }
  _notEmpty (value) {
    return !!value.trim();
  }
}


module.exports = GitignoreFileFilter;
