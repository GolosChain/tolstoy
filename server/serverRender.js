import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Iso from 'iso';
import { RouterContext, match } from 'react-router';
import { api } from 'golos-js';
import { Helmet } from 'react-helmet';

import RootRoute from 'app/RootRoute';
import { TITLE_SUFFIX, SEO_TITLE } from 'app/client_config';
import NotFound from 'app/components/pages/NotFound';
import getState from 'server/StateBuilder';
import { routeRegex } from 'app/ResolveRoute';
import { contentStats, calcVotesStats } from 'app/utils/StateFunctions';
import rootReducer from 'app/redux/reducers';
import Translator from 'app/Translator';
import extractMeta from 'app/utils/ExtractMeta';

export default async function serverRender({ uri, offchain, ErrorPage, settings, rates }) {
    let error, redirect, renderProps;

    try {
        [error, redirect, renderProps] = await runRouter(uri, RootRoute);
    } catch (e) {
        console.error('Routing error:', e.toString(), uri);
        return {
            title: 'Routing error | ' + TITLE_SUFFIX,
            statusCode: 500,
            body: renderToString(ErrorPage ? <ErrorPage /> : <span>Routing error</span>),
        };
    }
    if (error || !renderProps) {
        // debug('error')('Router error', error);
        return {
            title: 'Page Not Found | ' + TITLE_SUFFIX,
            statusCode: 404,
            body: renderToString(<NotFound.component />),
        };
    }

    // below is only executed on the server
    let serverStore, initialState;
    try {
        // uri = uri === '/' ? 'trending' : uri;

        const { location } = renderProps;
        initialState = await getState(api, location, { offchain, settings, rates });
        // protect for invalid account
        if (
            Object.getOwnPropertyNames(initialState.global.accounts).length === 0 &&
            (uri.match(routeRegex.UserProfile1) || uri.match(routeRegex.UserProfile3))
        ) {
            return {
                title: 'User Not Found | ' + TITLE_SUFFIX,
                statusCode: 404,
                body: renderToString(<NotFound.component />),
            };
        }

        // If we are not loading a post, truncate state data to bring response size down.
        if (!uri.match(routeRegex.Post)) {
            for (let key in initialState.global.content) {
                const post = initialState.global.content[key];
                // Count some stats then remove voting data. But keep current user's votes. (#1040)
                post.stats = contentStats(post);
                post.votesSummary = calcVotesStats(post['active_votes'], offchain.account);
                post['active_votes'] = post['active_votes'].filter(
                    vote => vote.voter === offchain.account
                );
            }
        }

        if (
            !uri.match(routeRegex.PostsIndex) &&
            !uri.match(routeRegex.UserProfile1) &&
            !uri.match(routeRegex.UserProfile2) &&
            uri.match(routeRegex.PostNoCategory)
        ) {
            const params = uri.substr(2, uri.length - 1).split('/');
            const content = await api.getContentAsync(params[0], params[1], undefined);
            if (content.author && content.permlink) {
                // valid short post uri
                initialState.global.content[uri.substr(2, uri.length - 1)] = content;
            } else {
                // protect on invalid user pages (i.e /user/transferss)
                return {
                    title: 'Page Not Found | ' + TITLE_SUFFIX,
                    statusCode: 404,
                    body: renderToString(<NotFound.component />),
                };
            }
        }

        initialState.offchain.server_location = uri;
        console.log(uri);
        serverStore = createStore(rootReducer, initialState);
        serverStore.dispatch({ type: '@@router/LOCATION_CHANGE', payload: { pathname: uri } });
    } catch (e) {
        // Ensure 404 page when username not found
        if (uri.match(routeRegex.UserProfile1)) {
            console.error('User/not found: ', uri);
            return {
                title: 'Page Not Found | ' + TITLE_SUFFIX,
                statusCode: 404,
                body: renderToString(<NotFound.component />),
            };
            // Ensure error page on state exception
        } else {
            const msg = (e.toString && e.toString()) || e.message || e;
            const stack_trace = e.stack || '[no stack]';
            console.error('State/store error: ', msg, stack_trace);
            return {
                title: 'Server error | ' + TITLE_SUFFIX,
                statusCode: 500,
                body: renderToString(<ErrorPage />),
            };
        }
    }

    let app, status, meta, helmet;
    try {
        app = renderToString(
            <Provider store={serverStore}>
                <Translator>
                    <RouterContext {...renderProps} />
                </Translator>
            </Provider>
        );
        helmet = Helmet.renderStatic();
        meta = extractMeta(initialState.global, renderProps.params);
        status = 200;
    } catch (err) {
        console.error('Rendering error: ', err, err.stack);
        app = renderToString(<ErrorPage />);
        status = 500;
    }

    const body = Iso.render(app, serverStore.getState());

    return {
        title: SEO_TITLE,
        meta,
        helmet,
        statusCode: status,
        body,
    };
}

function runRouter(location, routes) {
    return new Promise(resolve => match({ routes, location }, (...args) => resolve(args)));
}
