import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ThemeProvider, injectGlobal } from 'styled-components';
import { Helmet } from 'react-helmet';
import tt from 'counterpart';
import { key_utils } from 'golos-js/lib/auth/ecc';
import CloseButton from 'react-foundation-components/lib/global/close-button'; // TODO: make new component and delete

import { appSelector } from 'src/app/redux/selectors/app';
import user from 'app/redux/User';
import { REGISTRATION_URL } from 'app/client_config';
import { init as initAnchorHelper } from 'app/utils/anchorHelper';
import { locationChanged } from 'src/app/redux/actions/ui';

import defaultTheme from 'src/app/themes';
import Header from 'src/app/components/header/Header';
import Notifications from 'src/app/components/common/Notifications';
import Footer from 'src/app/components/common/Footer';
import TooltipManager from 'app/components/elements/common/TooltipManager';
import MobileAppButton from 'app/components/elements/MobileBanners/MobileAppButton';
import DialogManager from 'app/components/elements/common/DialogManager';
import Dialogs from '@modules/Dialogs';
import Modals from '@modules/Modals';
import ScrollButton from '@elements/ScrollButton';
import PageViewsCounter from '@elements/PageViewsCounter';

injectGlobal`
    html {
        height: 100%;
    }

    body {
        fill: currentColor;
    }
`;

@connect(
    appSelector,
    {
        loginUser: user.actions.usernamePasswordLogin,
        logoutUser: user.actions.logout,
        locationChanged,
    }
)
export default class App extends Component {
    static propTypes = {
        error: PropTypes.string,
        children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
        location: PropTypes.object,
        loginUser: PropTypes.func.isRequired,
        logoutUser: PropTypes.func.isRequired,
        locationChanged: PropTypes.func.isRequired,
    };

    state = {
        showCallout: true,
        showBanner: true,
    };

    componentWillMount() {
        if (process.env.BROWSER) {
            window.IS_MOBILE =
                /android|iphone/i.test(navigator.userAgent) || window.innerWidth < 765;

            window.INIT_TIMESSTAMP = Date.now();
        }

        this.props.locationChanged(this.props.location);
    }

    componentDidMount() {
        this.props.loginUser();

        window.addEventListener('storage', this.checkLogin);

        if (process.env.BROWSER) {
            initAnchorHelper();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('storage', this.checkLogin);
    }

    componentDidUpdate(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.setState({ showBanner: false, showCallout: false });
        }
    }

    componentWillReceiveProps(props) {
        const { location } = this.props;

        if (location.key !== props.location.key || location.action !== props.location.action) {
            this.props.locationChanged(props.location);
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
            if (event.newValue) {
                if (!event.oldValue || event.oldValue !== event.newValue) {
                    this.props.loginUser();
                }
            } else {
                this.props.logoutUser();

            }
        }
    };

    onEntropyEvent(e) {
        if (e.type === 'mousemove') {
            key_utils.addEntropy(e.pageX, e.pageY, e.screenX, e.screenY);
        } else {
            console.log('onEntropyEvent Unknown', e.type, e);
        }
    }

    renderWelcomeScreen() {
        const { params, location, newVisitor } = this.props;
        const params_keys = Object.keys(params);
        const ip =
            location.pathname === '/' ||
            (params_keys.length === 2 &&
                params_keys[0] === 'order' &&
                params_keys[1] === 'category');

        if (ip && newVisitor && this.state.showBanner) {
            return (
                <div className="welcomeWrapper">
                    <div className="welcomeBanner">
                        <CloseButton onClick={() => this.setState({ showBanner: false })} />
                        <div className="text-center">
                            <h2>{tt('submit_a_story.welcome_to_the_blockchain')}</h2>
                            <h4>{tt('submit_a_story.your_voice_is_worth_something')}</h4>
                            <br />
                            <a className="button" href={REGISTRATION_URL}>
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

        return null;
    }

    renderCallout() {
        const { error, flash } = this.props;
        const alert = error || flash.get('alert');
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

        return callout;
    }

    render() {
        const { location, children } = this.props;

        return (
            <ThemeProvider theme={defaultTheme}>
                <div className="App" onMouseMove={this.onEntropyEvent}>
                    <Helmet>
                        <title>Golos.io</title>
                    </Helmet>
                    <Header />
                    <div className="App__content">
                        {this.renderWelcomeScreen()}
                        {this.renderCallout()}
                        {children}
                        {location.pathname.startsWith('/submit') ? null : <Footer />}
                        <ScrollButton />
                        <MobileAppButton />
                    </div>
                    <Dialogs />
                    <Modals />
                    <DialogManager />
                    <Notifications />
                    {process.env.BROWSER ? <TooltipManager /> : null}
                    <PageViewsCounter hidden />
                </div>
            </ThemeProvider>
        );
    }
}
