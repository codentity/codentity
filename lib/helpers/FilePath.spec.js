var expect = require('chai').expect;
var FilePath = require('./FilePath');

describe('FilePath', function () {
  beforeEach(function () {
    this.absFilePaths = [
      '/Users/jpstevens/src/codentity/codentity-cli/lib/packages/loopback/icon.png',
      '/Users/jpstevens/src/codentity/codentity-cli/README.md'
    ];
    this.relFilePaths = [
      'lib/packages/loopback/icon.png',
      'README.md'
    ];
    this.baseDirectory = '/Users/jpstevens/src/codentity/codentity-cli';
    this.fp = FilePath.base(this.baseDirectory);
  });
  describe('.relative', function () {
    describe('with a single file path', function () {
      it('works', function () {
        expect(this.fp.absolute(this.relFilePaths[0])).to.equal(this.absFilePaths[0]);
        expect(this.fp.absolute(this.relFilePaths[1])).to.equal(this.absFilePaths[1]);
      });
    });
    describe('with multiple file paths', function () {
      it('works', function () {
        expect(this.fp.absolute(this.relFilePaths)).to.deep.equal(this.absFilePaths);
      });
    });
  });
  describe('.absolute', function () {
    describe('with a single file path', function () {
      it('works', function () {
        expect(this.fp.relative(this.absFilePaths)).to.deep.equal(this.relFilePaths);
      });
    });
  });
});
