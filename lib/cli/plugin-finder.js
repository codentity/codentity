'use strict';

const path = require('path');
const fs = require('fs');
const PLUGIN_DIRECTORY = path.resolve(__dirname, '../../..');

class PluginFinder {
  static list () {
    return new PluginFinder().list();
  }
  list () {
    return new Promise((resolve, reject) => {
      fs.readdir(PLUGIN_DIRECTORY, (err, filePaths) => {
        if (err) {
          if (err.code === 'ENOENT') return resolve([]);
          return reject(err);
        }
        resolve(this._identifyPlugins(filePaths));
      });
    });
  }
  _identifyPlugins (filePaths) {
    return filePaths.filter((filePath) => {
      return filePath.match(/^codentity-plugin-/);
    }).map((filePath) => {
      return filePath.replace(/^codentity-plugin-/, '');
    });
  }
}

module.exports = PluginFinder;
