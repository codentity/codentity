'use strict';

const Codentity = require('../core/codentity');
const FileSystemPreset = require('./file-system-preset');
const PluginFinder = require('./plugin-finder');
const path = require('path');
const DEFAULT_REGISTRY = 'https://codentity-registry.herokuapp.com/packages?format=lite';

class CodentityCli {
  constructor (program) {
    this._preset = FileSystemPreset.make({
      baseDir: this._parseDirectory(program.directory),
      registryUrl: this._parseRegistry(program.registry),
      packages: this._parsePackages(program.packages),
      plugins: this._parsePlugins(program.plugins)
    });
  }
  analyze () {
    if (this._plugins) return this._runAnalyzer();
    return PluginFinder.list().then((plugins) => {
      this._plugins = plugins;
      return this._runAnalyzer();
    });
  }
  static run (program) {
    return new CodentityCli(program).analyze()
    .then((data) => {
      process.stdout.write(JSON.stringify(data) + '\n');
    })
    .catch((err) => {
      process.stderr.write(err.stack + '\n');
      process.exit(1);
    });
  }
  _parseDirectory (directory) {
    if (!directory) return process.cwd();
    return path.resolve(process.cwd(), directory);
  }
  _parseRegistry (registry) {
    if (registry) return registry;
    return DEFAULT_REGISTRY;
  }
  _parsePackages (packages) {
    if (!packages) return;
    return JSON.parse(packages);
  }
  _parsePlugins (plugins) {
    if (plugins && plugins.length) this._plugins = plugins;
  }
  _runAnalyzer () {
    return Codentity
    .register(this._plugins)
    .filePaths(this._preset.filePaths.bind(this._preset))
    .packages(this._preset.packages.bind(this._preset))
    .provide(this._preset.provide.bind(this._preset))
    .analyze();
  }
}

module.exports = CodentityCli;
