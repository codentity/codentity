'use strict';

let Table = require('easy-table');
let _ = require('underscore');

const RESULT_LIMIT = 2;

class TableReporter {
  constructor (results) {
    this._results = results;
    this._getResultsHashForPackage
    this._table = new Table();
    Object.keys(results).forEach(this._getRow.bind(this));
  }
  static make (results) {
    return new TableReporter(results);
  }
  render () {
    return this._table.toString();
  }
  print () {
    console.log(this.render());
  }
  _getRow (pkgId) {
    this._table.cell('Package', pkgId)
    let pkgResults = this._getResultsHashForPackage(pkgId);
    this._table.cell('NPM', this._getNpmSummary(pkgResults))
    this._table.cell('Bower', this._getBowerSummary(pkgResults))
    this._table.cell('File Paths', this._getFileSummary(pkgResults))
    this._table.newRow();
  }
  _getResultsHashForPackage (pkgId) {
    return this._results[pkgId].reduce(function (obj, res) {
      obj[res.src] = (obj[res.src] || []).concat(res);
      return obj;
    }, {});
  }
  _getNpmSummary (pkgResults) {
    var matches = (pkgResults.packageJson || []).map(function (match) {
      return match.packageName;
    });
    return this._getSummaryText(matches);
  }
  _getBowerSummary (pkgResults) {
    var matches = (pkgResults.bowerJson || []).map(function (match) {
      return match.packageName;
    });
    return this._getSummaryText(matches);
  }
  _getFileSummary (pkgResults) {
    var matches = (pkgResults.file || []).map(function (match) {
      return match.filePath || match.packageName;
    });
    return this._getSummaryText(matches);
  }
  _getSummaryText (matches) {
    matches = matches || [].map(function (match) {
      return match.filePath || match.packageName;
    });
    let summary = _.first(matches, RESULT_LIMIT);
    let summaryText = summary.length ? summary.join(', ') : '-';
    let tooManyMatches = matches.length > RESULT_LIMIT;
    let etc = tooManyMatches ? ` + ${matches.length-RESULT_LIMIT} more` : '';
    return `${summaryText}${etc}`;
  }
}

module.exports = TableReporter;
