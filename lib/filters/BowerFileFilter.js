'use strict';

const path = require('path');

class BowerFileFilter {
  constructor (config) {
    config = config || {};
    this._bowerrc = this._parseBowerrc(config.bowerrc);
  }
  static make (config) {
    return new BowerFileFilter(config);
  }
  createFilter () {
    let bowerDirectory = this._getBowerDirectory();
    return function (filePath) {
      // NOTE this will over-identify e.g. bower_components_alt
      return (filePath.indexOf(bowerDirectory) === 0);
    };
  }
  filter (filePaths) {
    let filter = this.createFilter();
    return filePaths.filter(filter);
  }
  _parseBowerrc (rawBowerrc) {
    if (rawBowerrc === undefined) return;
    if (typeof rawBowerrc === 'string') return JSON.parse(rawBowerrc);
    if (typeof rawBowerrc === 'object') return rawBowerrc;
    throw new Error('Invalid .bowerrc');
  }
  _getBowerDirectory () {
    if (this._bowerrc && this._bowerrc.directory) {
      return path.normalize(this._bowerrc.directory);
    }
    return "bower_components";
  }
}

module.exports = BowerFileFilter;
