# line-info [![Build status](https://travis-ci.org/twolfson/line-info.png?branch=master)](https://travis-ci.org/twolfson/line-info)

Gather information about a line based on content and cursor position.

This was built as part of [commander-completion][], a shell completion library for [commander.js][].

[commander-completion]: https://github.com/twolfson/commander-completion
[commander.js]: https://github.com/visionmedia/commander.js

## Getting Started
Install the module with: `npm install line-info`

```javascript
var lineInfo = require('line-info');
lineInfo({
  // git checkout|world
  line: 'git checkoutworld',
  cursor: 12
});
/* Result is
{
  line: {
    value: 'git checkoutworld',
    index: 12, // 'git checkout'.length
    partialLeft: 'git checkout',
    partialRight: 'world'
  },
  words: {
    value: ['git', 'checkoutworld'],
    index: 1, // Position of 'checkoutworld'
    partialLeft: ['git', 'checkout'],
    partialRight: ['world']
  },
  word: {
    value: 'checkoutworld',
    index: 8, // 'checkout'.length
    partialLeft: 'checkout',
    partialRight: 'world'
  }
}
*/

// Accessed via `result.word.partialLeft`; // 'checkout'
```

## Documentation
`line-info` exposes a single function via its `module.exports`

### `lineInfo(params)`
Collect info about a line given a set of shell completion parameters.

**Input**

- params `Object` - Container for additional parameters
    - line `String` - Input to analyze (e.g. `npm publish`)
    - cursor `Number` - Position of cursor within string (e.g. `ec|ho hai` has a `cursor` of 2)

**Returned**

- retObj `Object` - Container for information
    - line `Object` - Container for `params.line` information
        - value `String` - Original input from `params.line`
        - index `Number` - Original cursor position from `params.cursor`
        - partialLeft `String`- Left section of line before cursor (e.g. `'npm pub'` in `npm pub|lish`)
        - partialRight `String`- Right section of line after cursor (e.g. `'lish'` in `npm pub|lish`)
    - words `Object` - Information about words in `line`
        - value `String[]` - Array of words in the `params.line`
        - index `Number` - Index of word containing cursor
        - partialLeft `String[]` - Array of words from `retObj.line.partialLeft` (e.g. `['npm', 'pub']` in `npm pub|lish`)
            - Word containing `cursor` will be broken up here
        - partialRight `String[]` - Array of words from `retObj.line.partialRight` (e.g. `['lish']` in `npm pub|lish`)
            - Word containing `cursor` will be broken up here
    - word `Object` - Information about word containing `cursor`
        - value `String` - Word containing `cursor`
        - index `Number` - Position of `cursor` within word
        - partialLeft `String` - Left section of word before cursor (e.g. `'pub'` in `npm pub|lish`)
        - partialRight `String` - Right section of word after cursor (e.g. `'lish'` in `npm pub|lish`)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Unlicense
As of Dec 17 2013, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
