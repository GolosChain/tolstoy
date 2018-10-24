import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import ScrollToTop from 'react-scroll-up';
import Icon from 'src/app/components/golos-ui/Icon';


const TopIcon = styled(Icon)`
    color: #393636;
    transform: rotate(90deg);
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
`;

export default class ScrollUpstairsButton extends Component {
    render() {
        return (
            <ScrollToTop showUnder={160} style={{ zIndex: 2 }}>
                <Wrapper data-tooltip={tt('g.upstairs')}>
                    <TopIcon name="arrow_left" />
                </Wrapper>
            </ScrollToTop>
        );
    }
}
