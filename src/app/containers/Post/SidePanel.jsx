import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import Icon from '../../components/golos-ui/Icon/Icon';
import is, { isNot } from 'styled-is';

const PADDING_FROM_HEADER = 22;
const HEADER_HEIGHT = 121;
const FOOTER_HEIGHT = 403;

const Wrapper = styled.div`
    position: fixed;
    bottom: 30px;
    left: calc(50% - 684px);
    width: 64px;
    min-height: 50px;
    padding: 15px 22px;
    border-radius: 32px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    opacity: 1;
    transition: visibility 0s linear 0s, opacity 0.3s;

    ${isNot('fixedOnScreen')`
        position: absolute;
    `};

    ${isNot('showPanel')`
        opacity: 0;
        transition: visibility 0s linear .3s, opacity .3s;
        visibility: hidden;
    `};

    & > div {
        padding: 10px 0;
    }

    @media (max-width: 1407px) {
        opacity: 0;
        transition: visibility 0s linear 0.3s, opacity 0.3s;
        visibility: hidden;
    }
`;

const CountOf = styled.div`
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    line-height: 23px;

    ${is('count')`
        padding-top: 5px;
    `};
`;

const ActionButton = styled.div`
    display: flex;
    align-items center;
    flex-direction: column;
`;

const ActionIconWrapper = styled.div`
    display: flex;
    padding: 5px;
    cursor: pointer;
    transition: transform 0.15s;

    &:hover {
        transform: scale(1.15);
    }
`;

const ActionBlock = ({ iconName, count }) => {
    return (
        <ActionButton>
            <ActionIconWrapper>
                <Icon width="20" height="20" name={iconName} />
            </ActionIconWrapper>
            <CountOf count={count}>{count}</CountOf>
        </ActionButton>
    );
};

class SidePanel extends Component {
    static propTypes = {
        sidePanelActions: PropTypes.arrayOf(
            PropTypes.shape({
                iconName: PropTypes.string.isRequired,
                count: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(null)]),
                actionOnClick: PropTypes.func.isRequired,
            })
        ).isRequired,
    };

    state = {
        showPanel: true,
        fixedOnScreen: true,
    };

    componentDidMount() {
        this._resizeScreenLazy();
        window.addEventListener('scroll', this._scrollScreenLazy);
        window.addEventListener('resize', this._resizeScreenLazy);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._scrollScreenLazy);
        window.removeEventListener('resize', this._resizeScreenLazy);
    }

    render() {
        const { sidePanelActions } = this.props;
        const { showPanel, fixedOnScreen } = this.state;
        return (
            <Wrapper
                innerRef={this._setWrapperRef}
                showPanel={showPanel}
                fixedOnScreen={fixedOnScreen}
            >
                {sidePanelActions.map((action, index) => {
                    return (
                        <ActionBlock key={index} iconName={action.iconName} count={action.count} />
                    );
                })}
            </Wrapper>
        );
    }

    _setWrapperRef = ref => {
        this.wrapperRef = ref;
    };

    _scrollScreen = () => {
        const documentElem = document.documentElement;
        const bottomBorder = documentElem.scrollHeight - FOOTER_HEIGHT;
        const offsetBottomOfScreen = documentElem.scrollTop + documentElem.clientHeight;
        if (bottomBorder <= offsetBottomOfScreen && this.state.fixedOnScreen) {
            this.setState({ fixedOnScreen: false });
        }
        if (bottomBorder > offsetBottomOfScreen && !this.state.fixedOnScreen) {
            this.setState({ fixedOnScreen: true });
        }
    };

    _resizeScreen = () => {
        const wrapperOffsetTop = this.wrapperRef.offsetTop;
        if (wrapperOffsetTop <= HEADER_HEIGHT + PADDING_FROM_HEADER && this.state.showPanel) {
            this.setState({ showPanel: false });
        }
        if (wrapperOffsetTop > HEADER_HEIGHT + PADDING_FROM_HEADER && !this.state.showPanel) {
            this.setState({ showPanel: true });
        }
        this._scrollScreenLazy();
    };

    _scrollScreenLazy = throttle(this._scrollScreen, 25, { leading: true });

    _resizeScreenLazy = throttle(this._resizeScreen, 25, { leading: true });
}

export default SidePanel;
