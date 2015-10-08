'use strict';

class JsonReporter {
  constructor (results) {
    this._results = results;
  }
  static make (results) {
    return new JsonReporter(results);
  }
  render () {
    return JSON.stringify(this._results, true, 2);
  }
  print () {
    console.log(this.render());
  }
}

module.exports = JsonReporter;
