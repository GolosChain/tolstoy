/* eslint-disable import/prefer-default-export,no-continue */
import { map, mapObjIndexed } from 'ramda';

export function mergeEntities(baseEntities, newEntities, { transform, merge } = {}) {
  let newItems = newEntities;

  if (transform) {
    newItems = map(transform, newItems);
  }

  if (merge) {
    newItems = mapObjIndexed((newItem, id) => {
      const cachedItem = baseEntities[id];

      if (cachedItem) {
        return merge(cachedItem, newItem);
      }

      return newItem;
    }, newItems);
  }

  return { ...baseEntities, ...newItems };
}
