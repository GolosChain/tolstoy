import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import Icon from '../../components/golos-ui/Icon/Icon';
import is, { isNot } from 'styled-is';

const footerBottom = 30;
const headerHeight = 121;
const footerHeight = 403;

const Wrapper = styled.div`
    position: fixed;
    bottom: ${footerBottom}px;
    left: calc(50% - 684px);
    width: 64px;
    min-height: 50px;
    padding: 15px 22px;
    border-radius: 32px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    opacity: 1;
    transition: visibility 0s linear 0s, opacity 0.3s;

    ${isNot('showPanel')`
        opacity: 0;
        transition: visibility 0s linear .3s, opacity .3s;
        visibility: hidden;
    `};

    & > div {
        padding: 10px 0;
    }

    @media (max-width: 1407px) {
        display: none;
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

const ActionIcon = Icon.extend`
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
            <ActionIcon width="30" height="30" name={iconName} />
            <CountOf count={count}>{count}</CountOf>
        </ActionButton>
    );
};

class SidePanel extends Component {
    static propTypes = {};

    static defaultProps = {};

    state = {
        showPanel: true,
    };

    componentDidMount() {
        this._scrollScreenLazy();
        this._resizeScreenLazy();
        window.addEventListener('scroll', this._scrollScreenLazy);
        window.addEventListener('resize', this._resizeScreenLazy);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._scrollScreenLazy);
        window.removeEventListener('resize', this._resizeScreenLazy);
    }

    render() {
        const { className, actionsData } = this.props;
        return (
            <Wrapper
                className={className}
                innerRef={this._setWrapperRef}
                showPanel={this.state.showPanel}
            >
                {actionsData.map((action, index) => {
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
        const bottomBorder = documentElem.scrollHeight - (footerHeight + footerBottom);
        const offsetBottomOfScreen = documentElem.scrollTop + documentElem.clientHeight;
        if (bottomBorder <= offsetBottomOfScreen && this.state.showPanel) {
            this.setState({
                showPanel: false,
            });
        }
        if (bottomBorder > offsetBottomOfScreen && !this.state.showPanel) {
            this.setState({
                showPanel: true,
            });
        }
    };

    _resizeScreen = () => {
        const wrapperOffsetTop = this.wrapperRef.offsetTop;
        if (wrapperOffsetTop <= headerHeight + footerBottom && this.state.showPanel) {
            this.setState({ showPanel: false });
        }
        if (wrapperOffsetTop > headerHeight + footerBottom && !this.state.showPanel) {
            this.setState({ showPanel: true });
        }
    };

    _scrollScreenLazy = throttle(this._scrollScreen, 100, { leading: true });

    _resizeScreenLazy = throttle(this._resizeScreen, 100, { leading: true });
}

const mapStateToProps = (state, props) => {
    /*const url = props.post.get('url');
    state.global.getIn(['content', props.permLink])
    const content = state.global.getIn(['content', url.replace(/.+@(.+)/, '$1')]);*/

    const actionsData = [
        {
            iconName: 'like',
            count: 20,
        },
        {
            iconName: 'dislike',
            count: 18,
        },
        {
            iconName: 'repost-right',
            count: 20,
        },
        {
            iconName: 'sharing_triangle',
            count: null,
        },
        {
            iconName: 'star',
            count: null,
        },
    ];
    return {
        actionsData,
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SidePanel);
