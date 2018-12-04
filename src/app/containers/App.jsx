import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, injectGlobal } from 'styled-components';
import { Helmet } from 'react-helmet';
import tt from 'counterpart';
import { key_utils } from 'golos-js/lib/auth/ecc';

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
import ContentErrorBoundary from 'src/app/containers/ContentErrorBoundary';

injectGlobal`
    html {
        height: 100%;
    }

    body {
        fill: currentColor;
    }
`;

function CloseButton() {
    return (
        <button className="close-button">
            <span aria-hidden="true">×</span>
        </button>
    );
}

export class App extends Component {
    static propTypes = {
        error: PropTypes.string,
        children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
        location: PropTypes.object,
        loginUser: PropTypes.func.isRequired,
        logoutUser: PropTypes.func.isRequired,
    };

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
        this.props.loginUser();
        sendNewVisitToAmplitudeCom();

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
                    <ContentErrorBoundary>
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
                    </ContentErrorBoundary>
                </div>
            </ThemeProvider>
        );
    }
}

function checkMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        window.navigator.userAgent
    );
}

function sendNewVisitToAmplitudeCom() {
    if (!sessionStorage.getItem(AMPLITUDE_SESSION)) {
        if (checkMobileDevice()) {
            window.amplitude.getInstance().logEvent('Attendance - new visitation (mobile)');
        } else {
            window.amplitude.getInstance().logEvent('Attendance - new visitation (desktop)');
        }
        sessionStorage.setItem(AMPLITUDE_SESSION, true);
    }
}
