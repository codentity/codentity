var NpmPackageFinder = require('./NpmPackageFinder'),
    expect = require('chai').expect;

var PACKAGE_JSON = {
  dependencies: {
    'grunt': '2.x'
  },
  devDependencies: {
    'underscore': '1.x',
    'grunt-contrib-clean': '2.x'
  }
};

describe('NpmPackageFinder', function () {

  beforeEach(function () {
    this.npm = NpmPackageFinder.make({
      packageJson: PACKAGE_JSON
    });
  });

  describe('.uses', function () {
    describe('and the package exists', function () {
      it('returns true', function () {
        expect(this.npm.uses('grunt')).to.equal(true);
      });
    });
    describe('and the package does not exist', function () {
      it('returns false', function () {
        expect(this.npm.uses('express')).to.equal(false);
      });
    });
  });

  describe('.find', function () {
    describe('and the package exists', function () {
      it('returns the expected result', function () {
        expect(this.npm.find('grunt')).to.deep.equal([{
          src: 'packageJson',
          version: '2.x',
          packageName: 'grunt',
          dependencyGroup: 'dependencies'
        }]);
      });
    });
    describe('and the package does not exist', function () {
      it('returns undefined', function () {
        expect(this.npm.find('express')).to.deep.equal([]);
      });
    });
  });

  describe('.findFirst', function () {
    describe('and the package exists', function () {
      it('returns the expected result', function () {
        expect(this.npm.findFirst('grunt')).to.deep.equal({
          src: 'packageJson',
          version: '2.x',
          packageName: 'grunt',
          dependencyGroup: 'dependencies'
        });
      });
    });
    describe('and the package does not exist', function () {
      it('returns undefined', function () {
        expect(this.npm.findFirst('express')).to.equal(undefined);
      });
    });
  });
});
