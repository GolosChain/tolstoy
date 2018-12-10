import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import tt from 'counterpart';

import { DEFAULT_LANGUAGE } from 'app/client_config';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import uk from 'react-intl/locale-data/uk';

import { getLocale } from 'src/app/redux/selectors/common';

addLocaleData([...en, ...ru, ...uk]);

tt.registerTranslations('en', require('app/locales/en.json'));
tt.registerTranslations('ru', require('app/locales/ru-RU.json'));
tt.registerTranslations('uk', require('app/locales/ua.json'));

@connect(state => ({
    locale: getLocale(state),
}))
export default class Translator extends Component {
    render() {
        const { locale, children } = this.props;
        const localeWithoutRegionCode =
            locale && typeof locale === 'string' ? locale.toLowerCase().split(/[_-]+/)[0] : 'ru'; // fix for firefox private mode

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
