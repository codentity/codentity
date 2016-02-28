'use strict';

const _ = require('lodash');

class PluginCollection {
  constructor (plugins) {
    this._plugins = [];
    this.add(plugins || []);
  }
  add (plugin) {
    if (_.isArray(plugin)) return this._addMany(plugin);
    return this._addOne(plugin);
  }
  getRequirements () {
    return this._plugins.reduce((requirements, plugin) => {
      return _.merge({}, requirements, plugin.requirements || {});
    }, {});
  }
  initialize (config) {
    this._initializeAll(config);
    return this;
  }
  filter (filePaths) {
    this._validateInitialized();
    return this._initializedPlugins.reduce((filteredFilePaths, plugin) => {
      return plugin.filter(filteredFilePaths);
    }, filePaths);
  }
  identify (pkg) {
    this._validateInitialized();
    return this._initializedPlugins.reduce((matches, plugin) => {
      return matches.concat(plugin.identify(pkg));
    }, []);
  }
  _initializeAll (config) {
    this._initializedPlugins = this._plugins.map((plugin) => {
      return plugin.make(config);
    });
    return this;
  }
  reinitialize (config, pluginName) {
    this._initializedPlugins.map((initializedPlugin) => {
      let thisConstructorName = initializedPlugin.constructor.name;
      let thisName = _.snakeCase(thisConstructorName).replace(/_plugin$/, '');
      if (thisName === pluginName) return initializedPlugin.reinitialize(config);
      return initializedPlugin;
    });
  }
  _addMany (plugins) {
    plugins.forEach(this._addOne.bind(this));
    return this;
  }
  _addOne (plugin) {
    this._validatePlugin(plugin);
    this._plugins = this._plugins.concat(plugin);
    return this;
  }
  _validatePlugin (plugin) {
    if (!_.isObject(plugin)) {
      this._throwError('Plugin must be an object');
    }
    if (!_.isString(plugin.name)) {
      this._throwError('Plugin missing static attribute: name');
    }
    if (!_.isFunction(plugin.prototype.filter)) {
      this._throwError(`Plugin missing instance method: filter`);
    }
    if (!_.isFunction(plugin.prototype.identify)) {
      this._throwError(`Plugin missing instance method: identify`);
    }
  }
  _validateInitialized () {
    if (!this._initializedPlugins) {
      throw new Error('Please initialize plugins before continuing');
    }
    if (!this._initializedPlugins.length) {
      throw new Error('No plugins initialized');
    }
  }
  _throwError (message) {
    throw new Error(message);
  }
}

module.exports = PluginCollection;
