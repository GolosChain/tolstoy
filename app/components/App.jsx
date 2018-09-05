import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import { ThemeProvider, injectGlobal } from 'styled-components';
import AppPropTypes from 'app/utils/AppPropTypes';
import Header from 'app/components/modules/Header';
import Footer from 'app/components/modules/Footer';
import TooltipManager from 'app/components/elements/common/TooltipManager';
import user from 'app/redux/User';
import g from 'app/redux/GlobalReducer';
import resolveRoute from 'app/ResolveRoute';
import CloseButton from 'react-foundation-components/lib/global/close-button';
import Dialogs from '@modules/Dialogs';
import Modals from '@modules/Modals';
import ScrollButton from '@elements/ScrollButton';
import { key_utils } from 'golos-js/lib/auth/ecc';
import MiniHeader from '@modules/MiniHeader';
import tt from 'counterpart';
import PageViewsCounter from '@elements/PageViewsCounter';

import MobileAppButton from 'app/components/elements/MobileBanners/MobileAppButton';
import DialogManager from 'app/components/elements/common/DialogManager';
import defaultTheme from 'src/app/themes';
import Notifications from 'src/app/components/common/Notifications';
import { init as initAnchorHelper } from 'app/utils/anchorHelper';

import { VEST_TICKER } from 'app/client_config';

injectGlobal`
    body {
        fill: currentColor;
    }
`;

const availableLinks = [
    'https://www.facebook.com/www.golos.io',
    'https://vk.com/goloschain',
    'https://t.me/golos_support',
];

const availableDomains = [
    'golos.io',
    'golos.blog',
    'golostools.com',
    'github.com',
    'play.google.com',
    't.me',
    'facebook.com',
    'vk.com',
    'instagram.com',
    'twitter.com',
    'explorer.golos.io',
    'kuna.com.ua',
    'forklog.com',
    'steepshot.io',
    'goldvoice.club',
    'oneplace.media',
    'golos.today',
    'cpeda.space',
    'linkedin.com',
];

class App extends Component {
    state = {
        showCallout: true,
        showBanner: true,
        expandCallout: false,
    };

    componentWillMount() {
        if (process.env.BROWSER) {
            window.IS_MOBILE =
                /android|iphone/i.test(navigator.userAgent) || window.innerWidth < 765;

            window.INIT_TIMESSTAMP = Date.now();
        }
    }

    componentDidMount() {
        this.props.loginUser();
        this.props.loadExchangeRates();

        window.addEventListener('storage', this.checkLogin);
        if (process.env.BROWSER) {
            window.addEventListener('click', this.checkLeaveGolos);
        }

        if (process.env.BROWSER) {
            initAnchorHelper();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('storage', this.checkLogin);
        if (process.env.BROWSER) {
            window.removeEventListener('click', this.checkLeaveGolos);
        }
    }

    componentDidUpdate(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.setState({ showBanner: false, showCallout: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const p = this.props;
        const n = nextProps;
        return (
            p.location !== n.location ||
            p.visitor !== n.visitor ||
            p.flash !== n.flash ||
            this.state !== nextState
        );
    }

    checkLogin = event => {
        if (event.key === 'autopost2') {
            if (!event.newValue) this.props.logoutUser();
            else if (!event.oldValue || event.oldValue !== event.newValue) this.props.loginUser();
        }
    };

    checkLeaveGolos = e => {
        const a = e.target.closest('a');

        if (
            a &&
            a.hostname &&
            a.hostname !== window.location.hostname &&
            !availableLinks.includes(a.href) &&
            !availableDomains.some(
                domain => domain === a.hostname || a.hostname.endsWith('.' + domain)
            )
        ) {
            e.stopPropagation();
            e.preventDefault();

            const url = `/leave_page?${a.href}`;

            if (a.target === '_blank' || e.ctrlKey || e.metaKey) {
                window.open(url, '_blank');
            } else {
                this.props.router.push(url);
            }
        }
    };

    onEntropyEvent(e) {
        if (e.type === 'mousemove') key_utils.addEntropy(e.pageX, e.pageY, e.screenX, e.screenY);
        else console.log('onEntropyEvent Unknown', e.type, e);
    }

    render() {
        const { location, params, children, flash, new_visitor } = this.props;

        const route = resolveRoute(location.pathname);
        const miniHeader = location.pathname === '/create_account';
        const params_keys = Object.keys(params);
        const ip =
            location.pathname === '/' ||
            (params_keys.length === 2 &&
                params_keys[0] === 'order' &&
                params_keys[1] === 'category');
        const alert = this.props.error || flash.get('alert');
        const warning = flash.get('warning');
        const success = flash.get('success');
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

        let welcome_screen = null;
        if (ip && new_visitor && this.state.showBanner) {
            welcome_screen = (
                <div className="welcomeWrapper">
                    <div className="welcomeBanner">
                        <CloseButton onClick={() => this.setState({ showBanner: false })} />
                        <div className="text-center">
                            <h2>{tt('submit_a_story.welcome_to_the_blockchain')}</h2>
                            <h4>{tt('submit_a_story.your_voice_is_worth_something')}</h4>
                            <br />
                            <a className="button" href="/create_account">
                                {' '}
                                <b>{tt('navigation.sign_up')}</b>{' '}
                            </a>
                            &nbsp; &nbsp; &nbsp;
                            <a
                                className="button hollow uppercase"
                                href="/start"
                                target="_blank"
                                onClick={this.learnMore}
                            >
                                {' '}
                                <b>{tt('submit_a_story.learn_more')}</b>{' '}
                            </a>
                            <br />
                            <br />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <ThemeProvider theme={defaultTheme}>
                <div
                    className={'App' + (ip ? ' index-page' : '') + (miniHeader ? ' mini-' : '')}
                    onMouseMove={this.onEntropyEvent}
                >
                    {miniHeader ? <MiniHeader /> : <Header />}
                    <div
                        className={cn('App__content', {
                            'App__content_hide-sub-menu': route.hideSubMenu,
                        })}
                    >
                        {welcome_screen}
                        {callout}
                        {children}
                        {location.pathname.startsWith('/submit') ? null : <Footer />}
                        <ScrollButton />
                        <MobileAppButton />
                    </div>
                    <Dialogs />
                    <Modals />
                    <Notifications />
                    <DialogManager />
                    {process.env.BROWSER ? <TooltipManager /> : null}
                    <PageViewsCounter hidden />
                </div>
            </ThemeProvider>
        );
    }
}

App.propTypes = {
    error: PropTypes.string,
    children: AppPropTypes.Children,
    location: PropTypes.object,
    loginUser: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
    depositSteem: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        error: state.app.get('error'),
        flash: state.offchain.get('flash'),
        new_visitor:
            !state.user.get('current') &&
            !state.offchain.get('user') &&
            !state.offchain.get('account') &&
            state.offchain.get('new_visit'),
    }),
    dispatch => ({
        loginUser: () => dispatch(user.actions.usernamePasswordLogin()),
        logoutUser: () => dispatch(user.actions.logout()),
        depositSteem: () => {
            dispatch(
                g.actions.showDialog({
                    name: 'blocktrades_deposit',
                    params: { outputCoinType: VEST_TICKER },
                })
            );
        },
        loadExchangeRates: () => {
            dispatch(g.actions.fetchExchangeRates());
        },
    })
)(App);
