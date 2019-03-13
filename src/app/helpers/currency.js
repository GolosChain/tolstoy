import React from 'react';
import { getStoreState, dispatch } from 'src/app/clientRender';
//import { getHistoricalData } from 'src/app/redux/actions/rates';
import { CURRENCIES, DEFAULT_CURRENCY } from 'src/app/client_config';

const CURRENCY_SIGNS = {
  USD: '$_',
  EUR: '€_',
  RUB: '_₽',
};

const MIN_DELEGATION_AMOUNT = 0.1; // GOLOS
const MIN_DELEGATION_AMOUNT_ERROR = 'Delegation difference is not enough';

const queried = new Set();

export function parseAmount(amount, balance, isFinal) {
  const amountFixed = amount.trim().replace(/\s+/, '');

  const amountValue = parseFloat(amountFixed);

  let error;

  const match = amountFixed.match(/\.(\d+)/);

  if (match && match[1].length > 3) {
    error = 'Можно использовать только 3 знака после запятой';
  } else if (!/^\d*(?:\.\d*)?$/.test(amountFixed)) {
    error = 'Неправильный формат';
  } else if (amountValue && amountValue > balance) {
    error = 'Недостаточно средств';
  } else if (amountFixed !== '' && amountValue === 0 && isFinal) {
    error = 'Введите сумму';
  }

  return {
    error,
    value: error ? null : amountValue,
  };
}

export function parseAmount2(amount, balance, isFinal, multiplier) {
  const amountFixed = amount.trim().replace(/\s+/, '');

  const amountValue = Math.round(parseFloat(amountFixed) * multiplier);

  let error;

  const match = amountFixed.match(/\.(\d+)/);

  if (match && match[1].length > 3) {
    error = 'Можно использовать только 3 знака после запятой';
  } else if (!/^\d*(?:\.\d*)?$/.test(amountFixed)) {
    error = 'Неправильный формат';
  } else if (amountValue && amountValue > balance) {
    error = 'Недостаточно средств';
  } else if (amountFixed !== '' && amountValue === 0 && isFinal) {
    error = 'Введите сумму';
  }

  return {
    error,
    value: error ? null : amountValue,
  };
}

// FIXME b1acksun
export function parseAmount3(amount, balance, isFinal, multiplier) {
  const { error, value } = parseAmount2(amount, balance, isFinal, multiplier);

  return {
    error: value < MIN_DELEGATION_AMOUNT * multiplier ? MIN_DELEGATION_AMOUNT_ERROR : error,
    value: error ? null : value,
  };
}

export function formatCurrency(amount, currency, decimals, allowZero) {
  let amountString;

  if (!amount) {
    amountString = '0';
  } else {
    if (decimals === 'short') {
      let value;
      let suffix = '';

      if (amount > 1000000000) {
        value = amount / 1000000000;
        suffix = 'B';
      } else if (amount > 1000000) {
        value = amount / 1000000;
        suffix = 'M';
      } else if (amount > 1000) {
        value = amount / 1000;
        suffix = 'K';
      } else {
        value = amount;
      }

      amountString = `${value.toFixed(value > 100 ? 0 : 1)}${suffix}`;
    } else {
      let decimalsCount;

      if (decimals === 'adaptive') {
        if (amount < 10 && !CURRENCY_SIGNS[currency]) {
          decimalsCount = 3;
        } else if (amount < 100) {
          decimalsCount = 2;
        } else if (amount < 1000) {
          decimalsCount = 1;
        } else {
          decimalsCount = 0;
        }
      } else if (decimals) {
        decimalsCount = decimals;
      } else {
        decimalsCount = CURRENCY_SIGNS[currency] ? 2 : 3;
      }

      amountString = amount.toFixed(decimalsCount);

      if (allowZero && /^0\.0+$/.test(amountString)) {
        amountString = '0';
      }
    }
  }

  if (CURRENCY_SIGNS[currency]) {
    return CURRENCY_SIGNS[currency].replace('_', amountString);
  } else {
    return `${amountString} ${currency}`;
  }
}

function getHistoricalRates(rates, date) {
  // date can be 1970-01-01 or 1969-12-31 (we must skip that dates)
  if (date.startsWith('2')) {
    // 2018-09-10T07:38:57 => 2018-09-10
    const dateString = date.substr(0, 10);

    const ratesInfo = rates.dates.get(dateString);

    if (!ratesInfo) {
      // TODO: TEMP SOLUTION, REMOVE IF AND SET LATER
      if (!queried.has(dateString)) {
        queried.add(dateString);
        dispatch(getHistoricalData(dateString));
      }
      return;
    }

    return ratesInfo;
  }
}

export function renderValue(
  amount,
  originalCurrency,
  { decimals, date, toCurrency, rates, settings, allowZero } = {}
) {
  if (!process.env.BROWSER) {
    if (typeof amount === 'string') {
      return amount;
    } else {
      let amountString = amount.toFixed(3);

      if (allowZero && amountString === '0.000') {
        amountString = '0';
      }

      return `${amountString} ${originalCurrency}`;
    }
  }

  if (typeof amount === 'string') {
    const parsed = amount.match(/^([\d.]+) (\w+)$/);

    if (!parsed) {
      return 'Invalid value';
    }

    amount = parseFloat(parsed[1]);

    if (CURRENCIES.includes(parsed[2])) {
      originalCurrency = parsed[2];
    }
  }

  if (!CURRENCIES.includes(originalCurrency)) {
    return 'Invalid value';
  }

  let rate;
  let currency =
    toCurrency ||
    (settings || getStoreState().data.settings).getIn(['basic', 'currency']) ||
    DEFAULT_CURRENCY;

  if (currency !== originalCurrency) {
    const useRates = rates || getStoreState().data.rates;

    if (date) {
      const ratesInfo = getHistoricalRates(useRates, date);

      if (ratesInfo) {
        rate = ratesInfo[originalCurrency][currency];
      }
    }

    if (!rate) {
      rate = useRates.actual[originalCurrency][currency];
    }
  }

  if (!rate) {
    currency = originalCurrency;
    rate = 1;
  }

  if (decimals == null) {
    decimals = (settings || getStoreState().data.settings).getIn(['basic', 'rounding'], 3);
  }

  return formatCurrency(amount * rate, currency, decimals, allowZero);
}
