const path = require('path');
const fs = require('fs');

const LITERAL_TYPES = new Set(['string', 'number', 'boolean']);
const LOCALES = ['en.json', 'ru-RU.json', 'ua.json'];

for (let locale of LOCALES) {
  process(locale);
}

function process(localeFile) {
  const localePath = path.join(__dirname, `../app/locales/${localeFile}`);

  const json = fs.readFileSync(localePath);

  const data = JSON.parse(json);

  const sortedData = recursiveSort(data);

  fs.writeFileSync(localePath, JSON.stringify(sortedData, null, 2) + '\n');
}

function recursiveSort(data) {
  if (Array.isArray(data)) {
    return data.map(item => recursiveSort(item));
  }

  const type = typeof data;

  if (LITERAL_TYPES.has(type)) {
    return data;
  }

  const keys = Object.keys(data);
  keys.sort();

  const newObject = {};

  for (let key of keys) {
    newObject[key] = recursiveSort(data[key]);
  }

  return newObject;
}
