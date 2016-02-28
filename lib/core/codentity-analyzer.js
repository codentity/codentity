'use strict';

const PluginCollection = require('./plugin-collection');
const PluginLoader = require('./plugin-loader');
const _ = require('lodash');

class CodentityAnalyzer {
  constructor (config) {
    config = config || {};
    this._packages = config.packages || [];
    this._filePaths = config.filePaths || [];
    this._plugins = new PluginCollection(config.plugins || []);
    this._initializers = {};
  }
  static make (config) {
    return new CodentityAnalyzer(config);
  }
  analyze () {
    return this._initialize().then(() => {
      return this._packages.reduce((matches, pkg) => {
        let match = this._plugins.identify(pkg);
        if (match.length) {
          matches[pkg.id] = (matches[pkg.id] || []).concat(match);
        }
        return matches;
      }, {});
    });
  }
  register (plugin) {
    let plugins = _.isArray(plugin) ? plugin : [plugin];
    let requiredPlugins = PluginLoader.load(plugins.filter(_.isString));
    let rawPlugins = plugins.filter(_.isObject);
    let pluginsToAdd = [].concat(requiredPlugins).concat(rawPlugins);
    this._plugins.add(pluginsToAdd);
    return this;
  }
  filePaths (arg) {
    return this._handleFunctionOrValue(arg, 'filePaths');
  }
  packages (arg) {
    return this._handleFunctionOrValue(arg, 'packages');
  }
  provide (fn) {
    this._initializers.provideFn = fn;
    return this;
  }
  _handleFunctionOrValue (arg, attr) {
    if (_.isUndefined(arg)) return this[`_${attr}`];
    if (_.isArray(arg)) {
      this[`_${attr}`] = arg;
      return this;
    }
    if (_.isFunction(arg)) {
      let initializeKey = _.camelCase('load_' + attr);
      this._initializers[initializeKey] = arg;
      return this;
    }
    throw new Error(`Invalid argument type: ${attr}`);
  }
  _initialize () {
    return Promise.all([
      this._initializePackages(),
      this._initializeFilePaths()
    ]).then((data) => {
      this._packages = data[0];
      this._filePaths = data[1];
    }).then(() => {
      return this._initializePlugins();
    }).then(() => {
      return this._initializeFileSystemPlugin();
    });
  }
  _initializeFileSystemPlugin () {
    // HACK for codentity-plugin-file-path, we need to re-initialize with filtered file
    this._plugins.reinitialize({
      filePaths: this._plugins.filter(this._filePaths)
    }, 'file');
  }
  _initializePlugins () {
    return this._getConfigArray()
    .then(this._flattenConfigArray.bind(this))
    .then((config) => {
      return this._plugins.initialize(config);
    });
  }
  _getConfigArray () {
    if (!this._initializers.provideFn) this._initializers.provideFn = _.noop;
    const requirements = this._plugins.getRequirements();
    const filePaths = this.filePaths();
    const promises = Object.keys(requirements).map((key) => {
      const query = requirements[key];
      return Promise.resolve(this._initializers.provideFn(query, key, filePaths))
      .then(this._createObjectWithKey(key));
    });
    return Promise.all(promises);
  }
  _createObjectWithKey (key) {
    return (data) => {
      let obj = {};
      obj[key] = data;
      return obj;
    };
  }
  _flattenConfigArray (configArray) {
    return _.merge.apply(null, [{}].concat(configArray));
  }
  _initializePackages () {
    const loadPackages = this._initializers.loadPackages;
    return Promise.resolve(_.isFunction(loadPackages) ? loadPackages() : this._packages);
  }
  _initializeFilePaths () {
    const loadFilePaths = this._initializers.loadFilePaths;
    return Promise.resolve(_.isFunction(loadFilePaths) ? loadFilePaths() : this._filePaths);
  }
}

module.exports = CodentityAnalyzer;
