import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, injectGlobal } from 'styled-components';
import { Helmet } from 'react-helmet';
import tt from 'counterpart';
import { key_utils } from 'golos-js/lib/auth/ecc';
import CloseButton from 'react-foundation-components/lib/global/close-button'; // TODO: make new component and delete

import { AMPLITUDE_SESSION } from 'app/client_config';
import { init as initAnchorHelper } from 'app/utils/anchorHelper';

import defaultTheme from 'src/app/themes';
import Header from 'src/app/components/header/Header';
import Notifications from 'src/app/components/common/Notifications';
import Footer from 'src/app/components/common/Footer';
import TooltipManager from 'app/components/elements/common/TooltipManager';
import MobileAppButton from 'app/components/elements/MobileBanners/MobileAppButton';
import DialogManager from 'app/components/elements/common/DialogManager';
import PageViewsCounter from '@elements/PageViewsCounter';
import ScrollUpstairsButton from 'src/app/components/common/ScrollUpstairsButton';
import CheckLoginOwner from 'src/app/components/common/CheckLoginOwner';

injectGlobal`
    html {
        height: 100%;
    }

    body {
        fill: currentColor;
    }
`;

export class App extends Component {
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
    };

    componentWillMount() {
        if (process.env.BROWSER) {
            window.IS_MOBILE =
                /android|iphone/i.test(navigator.userAgent) || window.innerWidth < 765;

            window.INIT_TIMESSTAMP = Date.now();
        }

        this.onLocationChange(this.props);
    }

    componentDidMount() {
        this.props.loginUser();
        this.sendNewVisitToAmplitudeCom();

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
            this.setState({ showCallout: false });
        }
    }

    componentWillReceiveProps(props) {
        const { location } = this.props;

        if (location.key !== props.location.key || location.action !== props.location.action) {
            this.onLocationChange(props);
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

    sendNewVisitToAmplitudeCom() {
        if (!sessionStorage.getItem(AMPLITUDE_SESSION)) {
            window.amplitude.getInstance().logEvent('Attendance - new visitation');
            sessionStorage.setItem(AMPLITUDE_SESSION, true);
        }
    }

    onEntropyEvent(e) {
        if (e.type === 'mousemove') {
            key_utils.addEntropy(e.pageX, e.pageY, e.screenX, e.screenY);
        } else {
            console.log('onEntropyEvent Unknown', e.type, e);
        }
    }

    onLocationChange(props) {
        props.locationChanged({ params: props.params, ...props.location });
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
                    <Helmet title="Golos.io" />
                    <Header />
                    <div className="App__content">
                        {this.renderCallout()}
                        {children}
                        {location.pathname.startsWith('/submit') ? null : <Footer />}
                        <ScrollUpstairsButton />
                        <MobileAppButton />
                    </div>
                    <DialogManager />
                    <CheckLoginOwner />
                    <Notifications />
                    {process.env.BROWSER ? <TooltipManager /> : null}
                    <PageViewsCounter hidden />
                </div>
            </ThemeProvider>
        );
    }
}
