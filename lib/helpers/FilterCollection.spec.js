var expect = require('chai').expect;
var FilterCollection = require('./FilterCollection');

describe('FilterCollection', function () {
  beforeEach(function () {
    this.odd = function (i) {
      var mod2 = i % 2;
      return !!mod2;
    };
    this.isPositive = function (i) {
      return i > 0;
    };
    this.sample = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.fc = new FilterCollection();
  });
  describe('.filter', function () {
    describe('when no filters are given', function () {
      it('returns the expected results', function () {
        var filtered = this.fc.filter(this.sample);
        expect(filtered).to.deep.equal(this.sample);
      });
    });
    describe('when one filter is given', function () {
      it('returns the expected results', function () {
        this.fc.add(this.isPositive.bind(this));
        var filtered = this.fc.filter(this.sample);
        expect(filtered).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      });
    });
    describe('when multiple filters are given', function () {
      it('returns the expected results', function () {
        this.fc.add(this.isPositive.bind(this));
        this.fc.add(this.odd.bind(this));
        var filtered = this.fc.filter(this.sample);
        expect(filtered).to.deep.equal([1, 3, 5, 7, 9]);
      });
    });
  });
  describe('.inverseFilter', function () {
    describe('when no filters are given', function () {
      it('returns the expected results', function () {
        var filtered = this.fc.inverseFilter(this.sample);
        expect(filtered).to.deep.equal(this.sample);
      });
    });
    describe('when one filter is given', function () {
      it('returns the expected results', function () {
        this.fc.add(this.isPositive.bind(this));
        var filtered = this.fc.inverseFilter(this.sample);
        expect(filtered).to.deep.equal([-3, -2, -1, 0]);
      });
    });
    describe('when multiple filters are given', function () {
      it('returns the expected results', function () {
        this.fc.add(this.isPositive.bind(this));
        this.fc.add(this.odd.bind(this));
        var filtered = this.fc.inverseFilter(this.sample);
        expect(filtered).to.deep.equal([-2, 0]);
      });
    });
  });
});
