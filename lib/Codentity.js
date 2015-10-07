'use strict';

let Analyzer = require('./Analyzer');
let request = require('request');

const REGISTRY_URL = 'https://codentity.herokuapp.com';

class Codentity {
  constructor (config) {
    config = config || {};
    this._packages = config.packages;
    this._registry = config.registry || REGISTRY_URL;
  }
  analyze (projectData) {
    if (this._packages) {
      return this._runAnalyzerAsync(projectData);
    } else {
      return this._getPackages()
      .then((packages) => {
        this._packages = packages;
        return this._runAnalyzerAsync(projectData);
      });
    }
  }
  static analyze (projectData) {
    return new Codentity().analyze(projectData);
  }
  _runAnalyzerAsync (projectData) {
    try {
      let results = this._runAnalyzer(projectData);
      return Promise.resolve(results);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  _runAnalyzer (projectData) {
    return new Analyzer({
      packages: this._packages
    }).analyze(projectData);
  }
  _getPackages () {
    var requestOptions = {
      method: 'GET',
      url: `${this._registry}/packages`,
      json: true
    };
    return new Promise ((resolve, reject) => {
      request(requestOptions, (err, response, body) => {
        if (err) return reject(err);
        // TODO handle response code !== 200
        resolve(body);
      });
    });
  }
}

module.exports = Codentity;
