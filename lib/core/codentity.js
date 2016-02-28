'use strict';

const CodentityAnalyzer = require('./codentity-analyzer');
const CodentityPlugin = require('codentity-plugin');

module.exports = {
  Analyzer: CodentityAnalyzer,
  Plugin: CodentityPlugin,
  make: CodentityAnalyzer.make,
  register: (plugin) => {
    return CodentityAnalyzer.make().register(plugin);
  },
  filePaths: (filePaths) => {
    return CodentityAnalyzer.make().filePaths(filePaths);
  },
  packages: (packages) => {
    return CodentityAnalyzer.make().packages(packages);
  },
  provide: (provideFn) => {
    return CodentityAnalyzer.make().provide(provideFn);
  }
};
