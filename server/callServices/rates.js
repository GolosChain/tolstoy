import config from 'config';

import { callApi } from './helpers';

const url = config.get('rates_service_url');

export async function getActualRates() {
    return (await callApi(url, 'getActual')).rates;
}
