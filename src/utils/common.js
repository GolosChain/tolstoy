/* eslint-disable import/prefer-default-export */

export function defaults(data, defaultData) {
  const result = { ...data };

  for (const keyName of Object.keys(defaultData)) {
    if (result[keyName] === undefined) {
      result[keyName] = defaultData[keyName];
    }
  }

  return result;
}
