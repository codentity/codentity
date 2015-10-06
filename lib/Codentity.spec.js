var Codentity = require('./Codentity');
var Path = require('path');
var Fs = require('fs');
var expect = require('chai').expect;

describe('Codentity', function () {
  beforeEach(function () {
    this.codentity = new Codentity().packages([{
      name: 'Star',
      filePath: ['*/**/match.js'],
      packageJson: ['*-match', 'match-*'],
      bowerJson: 'match-*'
    }, {
      name: 'Exact',
      filePath: 'match.js',
      packageJson: ['match','match-alt'],
      bowerJson: ['match']
    }]);
  });
  describe('.analyze', function () {
    describe('filePaths', function () {
      beforeEach(function () {
        this.result = this.codentity.analyze({
          filePaths: [
            'node_modules/match/match.js',
            'bower_components/match/match.js',
            'match.js',
            'nested/match.js',
            'nested/deep/match.js'
          ]
        });
      });
      it('returns an object', function () {
        expect(this.result).to.be.an.object;
        expect(this.result).to.not.deep.equal({});
      });
      it('returns the exact matched result', function () {
        expect(this.result.exact).to.deep.equal([{
          src: 'file',
          filePath: 'match.js'
        }]);
      });
      it('returns the minimatch (star) result', function () {
        expect(this.result.star).to.deep.equal([{
          src: 'file',
          filePath: 'nested/match.js',
        }, {
          src: 'file',
          filePath: 'nested/deep/match.js',
        }]);
      });
    });
    describe('packageJson', function () {
      beforeEach(function () {
        this.result = this.codentity.analyze({
          packageJson: {
            dependencies: {
              'my-match': '~0.1.0',
              'matcher': '~0.2.0',
              'match': '~0.3.0',
              'matcher-plus': '~0.4.0'
            },
            devDependencies: {
              'match-alt': '~0.5.0',
              'no-match-here': '~0.6.0'
            }
          }
        });
      });
      it('returns an object', function () {
        expect(this.result).to.be.an.object;
        expect(this.result).to.not.deep.equal({});
      });
      it('returns the exact matched result', function () {
        expect(this.result.exact).to.deep.equal([{
          src: 'packageJson',
          packageName: 'match',
          dependencyGroup: 'dependencies',
          version: '~0.3.0'
        }, {
          src: 'packageJson',
          packageName: 'match-alt',
          dependencyGroup: 'devDependencies',
          version: '~0.5.0'
        }]);
      });
      it('returns the minimatch (star) result', function () {
        expect(this.result.star).to.deep.equal([{
          src: 'packageJson',
          packageName: 'my-match',
          dependencyGroup: 'dependencies',
          version: '~0.1.0'
        }, {
          src: 'packageJson',
          packageName: 'match-alt',
          dependencyGroup: 'devDependencies',
          version: '~0.5.0'
        }]);
      });
    });
    describe('bowerJson', function () {
      beforeEach(function () {
        this.result = this.codentity.analyze({
          bowerJson: {
            dependencies: {
              'my-match': '~0.1.0',
              'matcher': '~0.2.0',
              'match': '~0.3.0',
              'matcher-plus': '~0.4.0'
            },
            devDependencies: {
              'match-alt': '~0.5.0',
              'no-match-here': '~0.6.0'
            }
          }
        });
      });
      it('returns an object', function () {
        expect(this.result).to.be.an.object;
        expect(this.result).to.not.deep.equal({});
      });
      it('returns the exact matched result', function () {
        expect(this.result.exact).to.deep.equal([{
          src: 'bowerJson',
          packageName: 'match',
          dependencyGroup: 'dependencies',
          version: '~0.3.0'
        }]);
      });
      it('returns the minimatch (star) result', function () {
        expect(this.result.star).to.deep.equal([{
          src: 'bowerJson',
          packageName: 'match-alt',
          dependencyGroup: 'devDependencies',
          version: '~0.5.0'
        }]);
      });
    });
  });
});
