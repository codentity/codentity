var expect = require('chai').expect;
var Path = require('path');
var FileLoader = require('./FileLoader');
var fs = require('fs');

describe('FileLoader', function () {

  describe('using the relative file path', function () {
    loadFile('fixtures/BOWERRC.json');
    loadRealFile('fixtures/BOWERRC.json');
    it('loads the correct file', function () {
      expect(this.file).to.equal(this.realFile);
    });
    it('does not throw an error', function () {
      expect(this.error).to.equal(undefined);
    });
  });

  describe('when the file does not exist', function () {
    loadFile('NO');
    it('does not load a file', function () {
      expect(this.file).to.equal(undefined);
    });
    it('throws an error', function () {
      expect(this.error).not.to.equal(undefined);
    });
  });

});

function initLoader () {
  var testDir = Path.resolve(__dirname, '../../test');
  return new FileLoader(testDir);
}

function loadFile (filePath) {
  var loader = initLoader();
  beforeEach(function (done) {
    loader.load(filePath).then(function (file) {
      this.file = file;
      done();
    }.bind(this))
    .catch(function (err) {
      this.error = err;
      done();
    }.bind(this));
  });
}

function loadRealFile (filePath) {
  beforeEach(function (done) {
    var testDir = Path.resolve(__dirname, '../../test');
    var absoluteFilePath = Path.resolve(testDir, filePath);
    fs.readFile(absoluteFilePath, 'utf-8', function (err, file) {
      if (err) {
        console.log(err.stack);
        process.exit(2);
      } else {
        this.realFile = file;
        done();
      }
    }.bind(this));
  });
}
