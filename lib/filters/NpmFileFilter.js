'use strict';

const path = require('path');

class NpmFileFilter {
  static make () {
    return new NpmFileFilter();
  }
  filter (filePaths) {
    let filter = this.createFilter();
    return filePaths.filter(filter);
  }
  createFilter () {
    let nodeModulesDir = this._getNodeModulesDirectory();
    return function (filePath) {
      // NOTE this will over-identify e.g. node_modules_temp
      return (filePath.indexOf(nodeModulesDir) === 0);
    };
  }
  _getNodeModulesDirectory () {
    // NOTE: https://github.com/npm/npm/issues/3597
    return "node_modules";
  }
}

module.exports = NpmFileFilter;
