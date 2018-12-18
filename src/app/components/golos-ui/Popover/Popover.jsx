import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { isNot } from 'styled-is';
import by from 'styled-by';

const Container = styled.div`
    position: absolute;
    z-index: 3;
    cursor: default;

    ${by('position', {
        left: `
            top: 50%;
            transform: translate(-100%, -50%);
        `,
        right: `
             top: 50%;
             transform: translate(100%, -50%);
        `,
        top: `
            left: 50%;
            bottom: 100%;
            margin-bottom: 10px;
        `,
        bottom: `
            left: 50%;
            top: 100%;
            margin-top: 10px;
        `,
    })};

    ${({ position, transform }) =>
        (position === 'top' || position === 'bottom') && `transform: ${transform}`};

    ${isNot('show')`
        height: 0;
        padding: 0;
        overflow: hidden;
    `};
`;

const Decoration = styled.div`
    width: 14px;
    height: 14px;
    position: absolute;
    transform: translateX(-50%) rotate(45deg);
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);

    ${by('position', {
        left: `
            top: calc(50% - 7px);
            right: -14px;`,
        right: `
            top: calc(50% - 7px);
            left: 0;
        `,
        top: `
            bottom: -7px;
            left: 50%;
        `,
        bottom: `
            top: -7px;
            left: 50%;
        `,
    })};

    ${({ position, transform }) =>
        (position === 'top' || position === 'bottom') && `transform: ${transform}`};
`;

const ContentWrapper = styled.div`
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    overflow: hidden;
`;

const Content = styled.div`
    background-color: #ffffff;
    position: relative;
`;

export default class Popover extends Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        withArrow: PropTypes.bool,
        closePopover: PropTypes.func,
        screenMargin: PropTypes.number,
        position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    };

    static defaultProps = {
        screenMargin: 20,
        position: 'bottom',
        closePopover: () => {},
        withArrow: true,
    };

    state = {
        margin: 0,
    };

    componentDidMount() {
        this.checkContainerBoundingClientRect();
        window.addEventListener('resize', this.checkScreenSizeLazy);
        window.addEventListener('click', this.checkClick, true);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkScreenSizeLazy);
        window.removeEventListener('click', this.checkClick, true);
        this.checkScreenSizeLazy.cancel();
    }

    checkClick = e => {
        if (this.props.show && !this.container.contains(e.target)) {
            this.props.closePopover();
        }
    };

    checkContainerBoundingClientRect = () => {
        const { margin } = this.state;
        const { screenMargin } = this.props;
        const x = Math.floor(
            this.container.getBoundingClientRect().x + margin - (margin ? screenMargin : 0)
        );
        this.setState({
            margin: x < 0 ? x : 0,
        });
    };

    checkScreenSizeLazy = throttle(this.checkContainerBoundingClientRect, 200, {
        leading: false,
    });

    render() {
        const { show, screenMargin, position, children, withArrow, className } = this.props;
        const { margin } = this.state;
        return (
            <Container
                className={className}
                innerRef={ref => (this.container = ref)}
                position={position}
                show={show}
                transform={
                    margin !== 0
                        ? `translateX(calc(-50% - ${margin}px + ${screenMargin}px));`
                        : `translateX(-50%)`
                }
            >
                {withArrow ? (
                    <Fragment>
                        <Decoration
                            position={position}
                            transform={
                                margin !== 0
                                    ? `translateX(calc(-50% + ${margin}px - ${screenMargin}px)) rotate(45deg);`
                                    : undefined
                            }
                        />
                        <ContentWrapper>
                            <Content>{children}</Content>
                        </ContentWrapper>
                    </Fragment>
                ) : (
                    <ContentWrapper>{children}</ContentWrapper>
                )}
            </Container>
        );
    }
}
