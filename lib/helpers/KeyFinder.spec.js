var expect = require('chai').expect;
var KeyFinder = require('./KeyFinder');

describe('KeyFinder', function () {
  beforeEach(function () {
    this.obj = {
      'apple': 32,
      'banana': 12,
      'orange': 30,
      'pineapple': 100
    };
    this.finder = new KeyFinder(this.obj);
  });
  describe('.find', function () {
    describe('with a string', function () {
      it('returns the expected results', function () {
        expect(this.finder.find('apple')).to.deep.equal([{
          key: 'apple',
          value: 32
        }]);
      });
    });
    describe('with a regexp', function () {
      it('returns the expected results', function () {
        expect(this.finder.find(/apple/)).to.deep.equal([{
          key: 'apple',
          value: 32
        }, {
          key: 'pineapple',
          value: 100
        }]);
      });
    });
    describe('when the result cannot be found', function () {
      it('returns an empty array', function () {
        expect(this.finder.find('carrot')).to.deep.equal([]);
      });
    });
  });
  describe('.findFirst', function () {
    describe('with a string', function () {
      it('returns the expected results', function () {
        expect(this.finder.findFirst('apple')).to.deep.equal({
          key: 'apple',
          value: 32
        });
      });
    });
    describe('with a regexp', function () {
      it('returns the expected results', function () {
        expect(this.finder.findFirst(/apple/)).to.deep.equal({
          key: 'apple',
          value: 32
        });
      });
    });
    describe('when the result cannot be found', function () {
      it('returns an empty array', function () {
        expect(this.finder.findFirst('carrot')).to.deep.equal(undefined);
      });
    });
  });
});
