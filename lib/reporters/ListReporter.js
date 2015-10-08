'use strict';

class ListReporter {
  constructor (results) {
    this._results = results;
  }
  static make (results) {
    return new ListReporter(results);
  }
  render () {
    return Object.keys(this._results).join('\n');
  }
  print () {
    console.log(this.render());
  }
}

module.exports = ListReporter;
