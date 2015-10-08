'use strict';

let Codentity = require('./Codentity');
let CodentityFileSystem = require('./CodentityFileSystem');
let TableReporter = require('./reporters/TableReporter');
let ListReporter = require('./reporters/ListReporter');
let JsonReporter = require('./reporters/JsonReporter');
let ChecklistReporter = require('./reporters/ChecklistReporter');

class CodentityCli {
  run (program) {
    this._program = program;
    this._getProjectData()
    .then(this._runAnalysis.bind(this))
    .then(this._printResults.bind(this))
    .catch(this._exit)
  }
  static run (program) {
    return new CodentityCli().run(program);
  }
  _getProjectData () {
    let options = { baseDirectory: this._program.directory };
    return new CodentityFileSystem(options).getProjectData();
  }
  _runAnalysis (projectData) {
    this._codentity = new Codentity(this._program)
    return this._codentity.analyze(projectData);
  }
  _exit (err) {
    console.error(err.stack);
    process.exit(1);
  }
  _printResults (results) {
    let artifacts = this._getArtifacts();
    let format = this._getFormat();
    switch (format) {
      case 'table': TableReporter.make(results).print(); break;
      case 'list': ListReporter.make(results).print(); break;
      case 'checklist': ChecklistReporter.make(results, artifacts).print(); break;
      case 'json': JsonReporter.make(results).print(); break;
      default: throw new Error(`"${format}" is not a valid format.`);
    }
  }
  _getArtifacts () {
    return this._codentity.getArtifacts();
  }
  _getFormat () {
    let format = this._program.format;
    if (format === undefined || format === true) return 'json';
    return format;
  }
}

module.exports = CodentityCli;
