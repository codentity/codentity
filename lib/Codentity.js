'use strict';

let _ = require('underscore');
let request = require('request');
let Analyzer = require('./Analyzer');
let appVersion = require('../package').version;

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
  getArtifacts () {
    return this._artifacts;
  }
  static analyze (projectData) {
    return new Codentity().analyze(projectData);
  }
  _createArtifacts () {
    this._artifacts = {
      packages: _.clone(this._packages)
    };
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
    let options = { packages: this._packages };
    let results = new Analyzer(options).analyze(projectData);
    this._createArtifacts(); // NOTE for debugging and reporting
    return results;
  }
  _getPackages () {
    var requestOptions = {
      method: 'GET',
      url: `${this._registry}/packages`,
      json: true,
      headers: {
        'version': appVersion
      }
    };
    return new Promise ((resolve, reject) => {
      request(requestOptions, (err, response, body) => {
        if (err) return reject(err);
        if (response.statusCode === 200) return resolve(body);
        reject(new Error(response.statusMessage || body.message));
      });
    });
  }
}

module.exports = Codentity;
