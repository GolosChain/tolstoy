import '@babel/register';
import '@babel/polyfill';
import 'whatwg-fetch';
import './assets/stylesheets/app.scss';
import * as golos from 'mocks/golos-js';
import Iso from 'iso';
import plugins from 'src/app/utils/JsPlugins';
import clientRender from 'src/app/clientRender';
import { addChunkLoadingErrorHandler } from 'src/app/helpers/browser';

function runApp(initialState) {
  const config = initialState.offchain.config;
  golos.config.set('websocket', config.ws_connection_client);
  golos.config.set('chain_id', config.chain_id);
  window.$STM_Config = config;
  plugins(config);

  if (initialState.offchain.serverBusy) {
    window.$STM_ServerBusy = true;
  }
  if (initialState.offchain.csrf) {
    window.$STM_csrf = initialState.offchain.csrf;
    delete initialState.offchain.csrf;
  }

  try {
    clientRender(initialState);
  } catch (err) {
    console.error(err);
  }

  addChunkLoadingErrorHandler();

  setTimeout(async () => {
    try {
      if (navigator.serviceWorker) {
        const registrations = await navigator.serviceWorker.getRegistrations();

        await Promise.all(registrations.map(reg => reg.unregister()));
      }
    } catch (err) {
      console.warn(err);
    }
  }, 3000);
}

if (!window.Intl) {
  require.ensure(
    ['intl/dist/Intl'],
    require => {
      window.IntlPolyfill = window.Intl = require('intl/dist/Intl');
      require('intl/locale-data/jsonp/en-US.js');
      Iso.bootstrap(runApp);
    },
    'IntlBundle'
  );
} else {
  Iso.bootstrap(runApp);
}
