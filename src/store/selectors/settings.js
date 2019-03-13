// eslint-disable-next-line import/prefer-default-export
import { dataSelector } from './common';

export const currentLocaleSelector = dataSelector(['settings', 'locale']);
export const nsfwTypeSelector = dataSelector(['settings', 'nsfw']);
