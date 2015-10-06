var expect = require('chai').expect;
var JsonPackageFinder = require('./JsonPackageFinder');

var JSON_FIXTURE = {
  top: {
    apple: 32,
    banana: 12
  },
  nested: {
    child: {
      apple: 32,
      banana: 12
    }
  },
  notIncluded: {
    apple: 32,
    banana: 12
  }
};

describe('JsonPackageFinder', function () {
  describe('.from', function () {
    it('returns the same instance as setting `json` through the constructor', function () {
      var json = { a: 1 };
      var regular = new JsonPackageFinder({ json: json });
      var updated = new JsonPackageFinder();
      expect(regular).to.deep.equal(updated.from(json));
    });
  });
  describe('.uses', function () {
    initFinder();
    describe('when the package is being used', function () {
      it('return true', function () {
        expect(this.finder.uses(/apple/)).to.equal(true);
        expect(this.finder.uses('apple')).to.equal(true);
      });
    });
    describe('when the package is not being used', function () {
      it('return false', function () {
        expect(this.finder.uses(/carrot/)).to.equal(false);
        expect(this.finder.uses('carrot')).to.equal(false);
      });
    });
  });
  describe('.find', function () {
    initFinder();
    describe('when the package is being used', function () {
      it('returns the expected result', function () {
        var result = [{
          path: 'top',
          key: 'apple',
          value: 32
        }, {
          path: ['nested', 'child'],
          key: 'apple',
          value: 32
        }];
        expect(this.finder.find('apple')).to.deep.equal(result);
        expect(this.finder.find(/apple/)).to.deep.equal(result);
      });
    });
    describe('when the package is not being used', function () {
      it('return false', function () {
        expect(this.finder.find('carrot')).to.deep.equal([]);
        expect(this.finder.find(/carrot/)).to.deep.equal([]);
      });
    });
  });
  describe('.findFirst', function () {
    initFinder();
    describe('when the package is being used', function () {
      it('returns the expected result', function () {
        var result = {
          path: 'top',
          key: 'apple',
          value: 32
        };
        expect(this.finder.findFirst('apple')).to.deep.equal(result);
        expect(this.finder.findFirst(/apple/)).to.deep.equal(result);
      });
    });
    describe('when the package is not being used', function () {
      it('return false', function () {
        expect(this.finder.findFirst('carrot')).to.equal(undefined);
        expect(this.finder.findFirst(/carrot/)).to.equal(undefined);
      });
    });
  });
});

function initFinder () {
  beforeEach(function () {
    this.finder = new JsonPackageFinder({
      json: JSON_FIXTURE,
      dependencyPaths: [
        'top',
        ['nested','child']
      ]
    });
  });
}
