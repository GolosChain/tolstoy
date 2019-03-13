import isEqual from 'react-fast-compare';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { path as ramdaPath } from 'ramda';

// utils for selectors
const toArray = path => (Array.isArray(path) ? path : [path]);

// Create a "selector creator" that uses lodash.isEqual instead of '==='
// More info you can find in: https://github.com/faassen/reselect#api
export const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

// Структура хранения данных приложения следующая
/*
{
    status: {
        contents: { ... },
        ...
    },
    entities: {
        contents: { ... },
        ...
    }
}
*/

// Выбирает конкретный статус из стора.
// С помощью переменной type указывается тип статуса.
export const statusSelector = type => state => state.status[type];
// Выбирает конкретные сущности из стора.
// С помощью переменной type указывается тип сущности.
export const entitiesSelector = type => state => state.entities[type];

// Entities selectors

// Возвращает сущности определенного типа (type) в виде массива.
export const entitiesArraySelector = type =>
  createDeepEqualSelector([entitiesSelector(type)], entities =>
    Object.keys(entities).map(id => entities[id])
  );

// Возвращает конкретную сушность по указанному типу (type) сущности и её id
export const entitySelector = (type, id) =>
  createDeepEqualSelector([entitiesSelector(type)], entities => entities[id]);

export const modeSelector = state => state.ui.mode;

// Выбирает поле ui из стора
export const uiSelector = path => state => ramdaPath(toArray(path))(state.ui);

export const dataSelector = path => state => ramdaPath(toArray(path))(state.data);
