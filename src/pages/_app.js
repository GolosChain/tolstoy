if (process.browser) {
  window.$STM_Config = {};
} else {
  global.$STM_Config = {};
}

import React from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import App, { Container } from 'next/app';
import Head from 'next/head';
import withRedux from 'next-redux-wrapper';
import { ThemeProvider } from 'styled-components';
// eslint-disable-next-line no-unused-vars
import fetch from 'isomorphic-unfetch'; // global/window
import { Cookies } from 'react-cookie';

import 'components/styles/index.scss';

import initStore from 'store/store';
import { setScreenTypeByUserAgent } from 'store/actions/ui';
import defaultTheme from 'themes';

//import { getAuth } from 'utils/localStore';
//import { login, setServerAccountName } from 'store/actions/gate/auth';

import Translator from 'shared/Translator';
import Header from 'components/header/Header';
import Notifications from 'components/common/Notifications';
import Footer from 'components/common/Footer';
import TooltipManager from 'components/elements/common/TooltipManager';
import MobileAppButton from 'components/elements/MobileBanners/MobileAppButton';
import DialogManager from 'components/elements/common/DialogManager';
import ScrollUpstairsButton from 'components/common/ScrollUpstairsButton';
import ContentErrorBoundary from 'containers/ContentErrorBoundary';

import tt from 'counterpart';
import { init as initAnchorHelper } from '../utils/anchorHelper';
//import { validateLocaleQuery } from '../utils/ParsersAndFormatters';

import { LOCALE_COOKIE_KEY, LOCALE_COOKIE_EXPIRES, AMPLITUDE_SESSION } from 'constants/config';
import { checkMobileDevice } from 'helpers/browser';

@withRedux(initStore, { debug: Boolean(process.env.DEBUG_REDUX) })
@connect(
  null,
  {
    loginUser: () => {},
    logoutUser: () => {},
  }
)
export default class GolosApp extends App {
  static propTypes = {
    error: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    location: PropTypes.object,
    loginUser: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
  };

  static async getInitialProps({ Component, ctx }) {
    if (ctx.req) {
      // const action = setScreenTypeByUserAgent(ctx.req.headers['user-agent']);
      //
      // if (action) {
      //     ctx.store.dispatch(action);
      // }
      //
      // const username = ctx.req.cookies['commun.username'];
      //
      // if (username) {
      //     ctx.store.dispatch(setServerAccountName(username));
      // }
    }

    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
      },
    };
  }

  state = {
    showCallout: true,
  };

  componentWillMount() {
    if (process.env.BROWSER) {
      window.IS_MOBILE = checkMobileDevice() || window.innerWidth < 765;
      window.INIT_TIMESSTAMP = Date.now();
    }
  }

  componentDidMount() {
    // // try to autologin
    // const auth = getAuth();
    //
    // if (auth) {
    //     const { store } = this.props;
    //     const { accountName, privateKey } = auth;
    //
    //     store.dispatch(login(accountName, privateKey));
    // }

    // this.props.loginUser();
    sendNewVisitToAmplitudeCom();

    window.addEventListener('storage', this.checkLogin);

    initAnchorHelper();

    // const locale = validateLocaleQuery(this.props.location);
    //
    // if (locale) {
    //     this.onChangeLocale(locale);
    //
    //     const uri = window.location.toString();
    //     window.history.replaceState({}, document.title, uri.substring(0, uri.indexOf('?')));
    // }
  }

  // componentDidUpdate(nextProps) {
  //     if (nextProps.location.pathname !== this.props.location.pathname) {
  //         this.setState({ showCallout: false });
  //     }
  // }

  componentWillUnmount() {
    window.removeEventListener('storage', this.checkLogin);
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log('CUSTOM ERROR HANDLING', error);
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  onChangeLocale = locale => {
    Cookies.save(LOCALE_COOKIE_KEY, locale, {
      path: '/',
      expires: LOCALE_COOKIE_EXPIRES,
    });
    this.props.changeLocale(locale);
  };

  checkLogin = event => {
    if (event.key === 'autopost2') {
      if (event.newValue) {
        if (!event.oldValue || event.oldValue !== event.newValue) {
          this.props.loginUser();
        }
      } else {
        this.props.logoutUser();
      }
    }
  };

  renderCallout() {
    // const { error, flash } = this.props;
    // const alert = error || flash.get('alert');
    // const warning = flash.get('warning');
    // const success = flash.get('success');
    const alert = null;
    const warning = null;
    const success = null;

    let callout = null;

    if (this.state.showCallout && (alert || warning || success)) {
      callout = (
        <div className="App__announcement row">
          <div className="column">
            <div className="callout">
              <CloseButton onClick={() => this.setState({ showCallout: false })} />
              <p>{alert || warning || success}</p>
            </div>
          </div>
        </div>
      );
    }

    if ($STM_Config.read_only_mode && this.state.showCallout) {
      callout = (
        <div className="App__announcement row">
          <div className="column">
            <div className="callout warning">
              <CloseButton onClick={() => this.setState({ showCallout: false })} />
              <p>{tt('g.read_only_mode')}</p>
            </div>
          </div>
        </div>
      );
    }

    return callout;
  }

  render() {
    const { Component, pageProps, router, store } = this.props;

    return (
      <Container>
        <Head>
          <title>Golos.io</title>
        </Head>
        <Provider store={store}>
          <Translator>
            <ThemeProvider theme={defaultTheme}>
              <div className="App">
                <Header onChangeLocale={this.onChangeLocale} />
                <ContentErrorBoundary>
                  <div className="App__content">
                    {this.renderCallout()}
                    <Component {...pageProps} />
                    {router.route === '/submit' ? null : <Footer />}
                    {router.route === '/submit' ? null : <ScrollUpstairsButton />}
                    <MobileAppButton />
                  </div>
                  <DialogManager />
                  <Notifications />
                  {process.browser ? <TooltipManager /> : null}
                </ContentErrorBoundary>
              </div>
            </ThemeProvider>
          </Translator>
        </Provider>
      </Container>
    );
  }
}

function CloseButton() {
  return (
    <button className="close-button">
      <span aria-hidden="true">×</span>
    </button>
  );
}

function sendNewVisitToAmplitudeCom() {
  if (!sessionStorage.getItem(AMPLITUDE_SESSION)) {
    if (window.amplitude) {
      if (checkMobileDevice()) {
        window.amplitude.getInstance().logEvent('Attendance - new visitation (mobile)');
      } else {
        window.amplitude.getInstance().logEvent('Attendance - new visitation (desktop)');
      }
      sessionStorage.setItem(AMPLITUDE_SESSION, true);
    }
  }
}
