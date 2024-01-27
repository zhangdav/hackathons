var assert = require('assert');
var lineInfo = require('../');

describe('A line', function () {
  before(function () {
    this.params = {
      line: 'git checkoutworld',
      cursor: 'git checkout'.length
    };
  });

  describe('when analyzed', function () {
    before(function () {
      this.actual = lineInfo(this.params);
    });

    it('matches expected `line` content', function () {
      assert.deepEqual(this.actual.line, {
        value: 'git checkoutworld',
        index: 'git checkout'.length,
        partialLeft: 'git checkout',
        partialRight: 'world'
      });
    });

    it('matches expeted `words` content', function () {
      assert.deepEqual(this.actual.words, {
        value: ['git', 'checkoutworld'],
        index: 1,
        partialLeft: ['git', 'checkout'],
        partialRight: ['world']
      });
    });

    it('matches expeted `words` content', function () {
      assert.deepEqual(this.actual.word, {
        value: 'checkoutworld',
        index: 'checkout'.length,
        partialLeft: 'checkout',
        partialRight: 'world'
      });
    });
  });
});

describe('A line with no right content', function () {
  before(function () {
    this.params = {
      line: 'npm publish',
      cursor: 'npm publish'.length
    };
  });

  describe('when analyzed', function () {
    before(function () {
      this.actual = lineInfo(this.params);
    });

    it('provides right content info', function () {
      assert.deepEqual(this.actual.words.partialRight, ['']);
      assert.strictEqual(this.actual.word.partialRight, '');
    });
  });
});

describe('A line with trailing whitespace', function () {
  before(function () {
    this.params = {
      line: 'npm publish ',
      cursor: 'npm publish'.length
    };
  });

  describe('when analyzed', function () {
    before(function () {
      this.actual = lineInfo(this.params);
    });

    it('provides considers whitespace as an empty word', function () {
      assert.deepEqual(this.actual.words.partialRight, ['', '']);
      assert.strictEqual(this.actual.word.partialRight, '');
    });
  });
});