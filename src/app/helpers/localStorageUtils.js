export function getValue(key, possibleValues) {
  try {
    const json = localStorage.getItem(`golos.${key}`);

    if (!json) {
      return null;
    }

    const value = JSON.parse(json);

    if (possibleValues && !possibleValues.includes(value)) {
      return null;
    }

    return value;
  } catch (err) {
    console.warn(err);
  }
}

export function saveValue(key, value) {
  try {
    localStorage.setItem(`golos.${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn(err);
  }
}
