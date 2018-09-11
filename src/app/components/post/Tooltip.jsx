import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import is, { isNot } from 'styled-is';

const Container = styled.div`
    max-width: calc(100vw - ${({ screenMargin }) => screenMargin * 3}px);
    position: absolute;
    left: 50%;
    padding-top: 10px;
    top: 100%;
    z-index: 1;

    ${is('up')`
        padding-bottom: 10px;
        top: auto;
        bottom: 100%;
    `};

    transform: translateX(-50%);
    ${({ margin, screenMargin }) =>
        margin !== 0 &&
        `
            transform: translateX(calc(-50% - ${margin}px + ${screenMargin}px));
        `};
    cursor: default;
    ${isNot('isOpen')`
        height: 0;
        padding-top: 0;
        padding-bottom: 0;
        overflow: hidden;
    `};
    z-index: 1;
`;

const Decoration = styled.div`
    width: 14px;
    height: 14px;
    position: absolute;
    ${({ up }) => (up ? 'bottom: 4px;' : 'top: 4px;')};
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    background-color: white;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5), 0 2px 12px 0 rgba(0, 0, 0, 0.15);

    ${({ margin, screenMargin }) =>
        margin !== 0 &&
        `
            transform: translateX(calc(-50% + ${margin}px - ${screenMargin}px)) rotate(45deg);
        `};
`;

const ContentWrapper = styled.div`
    background-color: white;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5), 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    overflow: hidden;
`;

const Content = styled.div`
    background-color: white;
    position: relative;
`;

class Tooltip extends Component {
    static propTypes = {
        screenMargin: PropTypes.number,
        up: PropTypes.bool,
        changedIsOpen: PropTypes.func,
    };

    static defaultProps = {
        screenMargin: 20,
        up: false,
        changedIsOpen: () => {},
    };

    state = {
        margin: 0,
        isOpen: false,
    };

    componentDidMount() {
        this._checkContainerBoundingClientRect();
        window.addEventListener('resize', this._checkScreenSizeLazy);
        window.addEventListener('click', this._checkClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._checkScreenSizeLazy);
        window.removeEventListener('click', this._checkClickOutside);
    }

    render() {
        const { screenMargin, up, children, className } = this.props;
        const { margin, isOpen } = this.state;
        return (
            <Container
                className={className}
                innerRef={ref => (this.container = ref)}
                margin={margin}
                screenMargin={screenMargin}
                up={up}
                isOpen={isOpen}
            >
                <Decoration margin={margin} screenMargin={screenMargin} up={up} />
                <ContentWrapper>
                    <Content>{children}</Content>
                </ContentWrapper>
            </Container>
        );
    }

    open = () => {
        if (!this.state.isOpen) {
            this.props.changedIsOpen();
            this.setState({ isOpen: true });
        }
    };

    close = () => {
        if (this.state.isOpen) {
            this.props.changedIsOpen();
            this.setState({ isOpen: false });
        }
    };

    _checkClickOutside = e => {
        if (this.state.isOpen && !this.container.contains(event.target)) {
            e.stopPropagation();
            this.close();
        }
    };

    _checkContainerBoundingClientRect = () => {
        const { margin } = this.state;
        const { screenMargin } = this.props;
        const x = Math.floor(
            this.container.getBoundingClientRect().x + margin - (margin ? screenMargin : 0)
        );
        if (x < 0) {
            this.setState({
                margin: x,
            });
        } else {
            this.setState({
                margin: 0,
            });
        }
    };

    _checkScreenSizeLazy = throttle(this._checkContainerBoundingClientRect, 200, {
        leading: false,
    });
}

export default Tooltip;
