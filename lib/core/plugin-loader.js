'use strict';

const path = require('path');

class PluginLoader {
  static load (pluginNames) {
    return pluginNames.map((pluginName) => {
      const fqPluginName = `codentity-plugin-${pluginName}`;
      return require(`../../../${fqPluginName}`);
    });
  }
}

module.exports = PluginLoader;
