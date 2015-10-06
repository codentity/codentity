var BowerPackageFinder = require('./BowerPackageFinder'),
    expect = require('chai').expect;

var BOWER_JSON = {
  dependencies: {
    'angular': '2.x'
  },
  devDependencies: {
    'underscore': '1.x',
    'angular-mocks': '2.x'
  }
};

describe('BowerPackageFinder', function () {

  beforeEach(function () {
    this.bower = BowerPackageFinder.make({
      bowerJson: BOWER_JSON
    });
  });

  describe('.uses', function () {
    describe('when the query is a string', function () {
      describe('and the package exists', function () {
        it('returns true', function () {
          expect(this.bower.uses('angular')).to.equal(true);
        });
      });
      describe('and the package does not exist', function () {
        it('returns false', function () {
          expect(this.bower.uses('jquery')).to.equal(false);
        });
      });
    });
    describe('when the query is RegExp', function () {
      describe('and the package exists', function () {
        it('returns true', function () {
          expect(this.bower.uses(/^angular(-)?/)).to.equal(true);
        });
      });
      describe('and the package does not exist', function () {
        it('returns false', function () {
          expect(this.bower.uses(/jquery/)).to.equal(false);
        });
      });
    });
    describe('when the query is an array', function () {
      it('works');
    });
  });

  describe('.find', function () {
    describe('when the query is a string', function () {
      describe('and the package exists', function () {
        it('returns the expected result', function () {
          expect(this.bower.find('angular')).to.deep.equal([{
            src: 'bowerJson',
            version: '2.x',
            packageName: 'angular',
            dependencyGroup: 'dependencies'
          }]);
        });
      });
      describe('and the package does not exist', function () {
        it('returns undefined', function () {
          expect(this.bower.find('jquery')).to.deep.equal([]);
        });
      });
    });
    describe('when the query is RegExp', function () {
      describe('and the package exists', function () {
        it('returns the expected result', function () {
          expect(this.bower.find(/^angular(-)?/)).to.deep.equal([{
            src: 'bowerJson',
            version: '2.x',
            packageName: 'angular',
            dependencyGroup: 'dependencies'
          }, {
            src: 'bowerJson',
            version: '2.x',
            packageName: 'angular-mocks',
            dependencyGroup: 'devDependencies'
          }]);
        });
      });
      describe('and the package does not exist', function () {
        it('returns undefined', function () {
          expect(this.bower.find(/jquery/)).to.deep.equal([]);
        });
      });
    });
    describe('when the query is an array', function () {
      it('works');
    });
  });

  describe('.findFirst', function () {
    describe('when the query is a string', function () {
      describe('and the package exists', function () {
        it('returns the expected result', function () {
          expect(this.bower.findFirst('angular')).to.deep.equal({
            src: 'bowerJson',
            version: '2.x',
            packageName: 'angular',
            dependencyGroup: 'dependencies'
          });
        });
      });
      describe('and the package does not exist', function () {
        it('returns undefined', function () {
          expect(this.bower.findFirst('jquery')).to.equal(undefined);
        });
      });
    });
    describe('when the query is RegExp', function () {
      describe('and the package exists', function () {
        it('returns the expected result', function () {
          expect(this.bower.findFirst(/^angular(-)?/)).to.deep.equal({
            src: 'bowerJson',
            version: '2.x',
            packageName: 'angular',
            dependencyGroup: 'dependencies'
          });
        });
      });
      describe('and the package does not exist', function () {
        it('returns undefined', function () {
          expect(this.bower.findFirst(/jquery/)).to.equal(undefined);
        });
      });
      describe('when the query is an array', function () {
        it('works');
      });
    });
  });

});
