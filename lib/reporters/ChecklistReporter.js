'use strict';

let chalk = require('chalk');

class ChecklistReporter {
  constructor (results, artifacts) {
    this._results = results;
    this._packages = artifacts.packages || [];
  }
  static make (results, artifacts) {
    return new ChecklistReporter(results, artifacts);
  }
  render () {
    return this._packages.map((pkg) => {
      let included = !!this._results[pkg.id];
      let icon = included ? chalk.green('✔') : chalk.dim.red('✘');
      return `${icon} ${pkg.name}`;
    }).join('\n');
  }
  print () {
    console.log(this.render());
  }
}

module.exports = ChecklistReporter;
