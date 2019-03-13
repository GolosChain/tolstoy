import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import tt from 'counterpart';

import { DEFAULT_LANGUAGE } from 'src/app/client_config';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import uk from 'react-intl/locale-data/uk';

addLocaleData([...en, ...ru, ...uk]);

tt.registerTranslations('en', require('src/app/locales/en.json'));
tt.registerTranslations('ru', require('src/app/locales/ru-RU.json'));
tt.registerTranslations('uk', require('src/app/locales/ua.json'));

@connect(state => ({
  // TODO:
  locale: 'ru',
}))
export default class Translator extends PureComponent {
  render() {
    const { locale, children } = this.props;
    const localeWithoutRegionCode =
      locale && typeof locale === 'string'
        ? locale.toLowerCase().split(/[_-]+/)[0]
        : DEFAULT_LANGUAGE; // fix for firefox private mode

    tt.setLocale(localeWithoutRegionCode);
    tt.setFallbackLocale('en');

    return (
      <IntlProvider
        key={localeWithoutRegionCode}
        locale={localeWithoutRegionCode}
        defaultLocale={DEFAULT_LANGUAGE}
      >
        {children}
      </IntlProvider>
    );
  }
}
