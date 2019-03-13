const en = require('../src/locales/en.json');
const ru = require('../src/locales/ru-RU.json');
const ua = require('../src/locales/ua.json');

const data = {
  en: extractKeys(en),
  ru: extractKeys(ru),
  ua: extractKeys(ua),
};

printDiff('en', 'ru');
printDiff('en', 'ua');

function extractKeys(obj) {
  const keys = new Set();

  _extractKeys(keys, obj, '');

  return keys;
}

function _extractKeys(keys, obj, path) {
  for (let key of Object.keys(obj)) {
    const node = obj[key];

    const newPath = (path ? path + '.' : '') + key;

    if (typeof node === 'string') {
      keys.add(newPath);
    } else {
      _extractKeys(keys, node, newPath);
    }
  }
}

function printDiff(lang1, lang2) {
  const a = data[lang1];
  const b = data[lang2];

  const onlyInA = [];
  const onlyInB = [];

  for (let key of a) {
    if (!b.has(key)) {
      onlyInA.push(key);
    }
  }

  for (let key of b) {
    if (!a.has(key)) {
      onlyInB.push(key);
    }
  }

  console.log(`== Comparison [${lang1}] and [${lang2}]:`);

  if (onlyInA.length) {
    console.log(`  Has not in [${lang2}]:\n    ` + onlyInA.join('\n    '));
    console.log();
  }

  if (onlyInB.length) {
    console.log(`  Only in [${lang2}]:\n    ` + onlyInB.join('\n    '));
    console.log();
  }
}
