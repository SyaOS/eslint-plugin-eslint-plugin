'use strict';

const fs = require('fs');
const path = require('path');
const rules = require('..').rules;

const README_LOCATION = path.resolve(__dirname, '..', 'README.md');
const BEGIN_TABLE_MARKER = '<!-- __BEGIN AUTOGENERATED TABLE__ -->\n';
const END_TABLE_MARKER = '\n<!-- __END AUTOGENERATED TABLE__ -->';

const expectedTableLines = Object.keys(rules)
  .sort()
  .reduce((lines, ruleId) => {
    const rule = rules[ruleId];

    lines.push([
      `[${ruleId}](https://github.com/not-an-aardvark/eslint-plugin-eslint-plugin/blob/master/docs/rules/${ruleId}.md)`,
      rule.meta.docs.recommended ? '✔️' : '',
      rule.meta.fixable ? '🛠' : '',
      rule.meta.hasSuggestions ? '💡' : '',
      rule.meta.docs.description,
    ].join(' | '));

    return lines;
  }, ['Name | ✔️ | 🛠 | 💡 | Description', '----- | ----- | ----- | ----- | -----'])
  .join('\n');

const readmeContents = fs.readFileSync(README_LOCATION, 'utf8');

if (!readmeContents.includes(BEGIN_TABLE_MARKER)) {
  throw new Error(`Could not find '${BEGIN_TABLE_MARKER}' marker in README.md.`);
}

if (!readmeContents.includes(END_TABLE_MARKER)) {
  throw new Error(`Could not find '${END_TABLE_MARKER}' marker in README.md.`);
}

const linesStartIndex = readmeContents.indexOf(BEGIN_TABLE_MARKER) + BEGIN_TABLE_MARKER.length;
const linesEndIndex = readmeContents.indexOf(END_TABLE_MARKER);

const updatedReadmeContents = readmeContents.slice(0, linesStartIndex) +
  expectedTableLines +
  readmeContents.slice(linesEndIndex);

if (module.parent) {
  module.exports = updatedReadmeContents;
} else {
  fs.writeFileSync(README_LOCATION, updatedReadmeContents);
}
