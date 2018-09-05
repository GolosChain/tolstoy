import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import is from 'styled-is';
import throttle from 'lodash/throttle';

const Container = styled.div`
    width: 500px;
    max-width: calc(100vw - ${({ screenMargin }) => screenMargin * 3}px);
    height: 200px;
    position: absolute;
    top: 100%;
    left: 50%;
    display: flex;
    flex-direction: column;
    ${is('up')`
        justify-content: revert;
    `};

    padding-top: 10px;
    transform: translateX(-50%);

    ${({ margin, screenMargin }) =>
        margin !== 0 &&
        `
            transform: translateX(calc(-50% - ${margin}px + ${screenMargin}px));
        `};
`;

const Decoration = styled.div`
    width: 14px;
    height: 14px;
    position: absolute;
    top: 4px;
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
    width: 100%;
    height: 100%;
    background-color: white;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5), 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    overflow: hidden;
`;

const Content = styled.div`
    width: 100%;
    height: 100%;
    background-color: white;
    position: relative;
`;

class Popover extends Component {
    static propTypes = {
        screenMargin: PropTypes.number,
        up: PropTypes.bool,
    };

    static defaultProps = {
        screenMargin: 20,
        up: false,
    };

    state = {
        margin: 0,
    };

    componentDidMount() {
        this._checkContainerBoundingClientRect();
        window.addEventListener('resize', this._checkScreenSizeLazy);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._checkScreenSizeLazy);
    }

    render() {
        const { screenMargin, up, className } = this.props;
        const { margin } = this.state;
        return (
            <Container
                className={className}
                innerRef={ref => (this.container = ref)}
                margin={margin}
                screenMargin={screenMargin}
                up={up}
            >
                <Decoration margin={margin} screenMargin={screenMargin} />
                <ContentWrapper>
                    <Content />
                </ContentWrapper>
            </Container>
        );
    }

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

export default Popover;
