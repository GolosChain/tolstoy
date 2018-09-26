import { RATES_GET_HISTORICAL } from '../constants/rates';

export function getHistoricalData(date) {
    return { type: RATES_GET_HISTORICAL, payload: { date } };
}
