import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import ScrollToTop from 'react-scroll-up';
import Icon from 'src/app/components/golos-ui/Icon';
import { logClickEvent } from 'src/app/helpers/gaLogs';

const TopIcon = styled(Icon)`
    flex-shrink: 0;

    color: #393636;
    transform: rotate(90deg);

    @media (max-width: 576px) {
        width: 10px;
        height: 13px;

        right: 0;
        bottom: 10px;
    }
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 32px;
    bottom: 20px;

    width: 64px;
    height: 64px;

    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #ffffff;
    }

    &:hover ${TopIcon} {
        color: #2879ff;
    }

    @media (max-width: 576px) {
        width: 34px;
        height: 34px;

        right: 0;
        bottom: 10px;
    }
`;

export default class ScrollUpstairsButton extends Component {
    logEvent = () => {
        logClickEvent('Button', 'click', 'Scroll upstairs');
    };

    render() {
        return (
            <ScrollToTop showUnder={160} style={{ zIndex: 2 }}>
                <Wrapper
                    role="button"
                    aria-label="tt('g.upstairs')"
                    data-tooltip={tt('g.upstairs')}
                    onClick={this.logClickEvent}
                >
                    <TopIcon name="arrow_left" />
                </Wrapper>
            </ScrollToTop>
        );
    }
}
