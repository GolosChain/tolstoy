import React, { PureComponent, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon';
import { listenLazy } from 'src/app/helpers/hoc';
import { FORCE_LINES_WIDTH } from 'src/app/components/common/CardsList/CardsList';
import LayoutSwitcherMenu from './LayoutSwitcherMenu';

const LAYOUTS = ['list', 'compact', 'grid'];

const Handle = styled.button`
    display: block;
    padding: 7px;
    margin-left: 7px;
    border: none;
    background: none;
    outline: none;
    color: #b7b7b9;
    cursor: pointer;
    -webkit-appearance: none;

    &:hover {
        color: #2879ff;
    }
`;

const IconStyled = styled(Icon)`
    display: block;
    width: 20px;
    height: 20px;
    transition: color 0.15s;
`;

@listenLazy('resize')
export default class LayoutSwitcher extends PureComponent {
    static propTypes = {
        layout: PropTypes.oneOf(['list', 'grid', 'compact']).isRequired,
        changeProfileLayout: PropTypes.func.isRequired,
    };

    state = {
        isMobile: process.env.BROWSER ? window.innerWidth < FORCE_LINES_WIDTH : false,
        open: false,
    };

    handle = createRef();

    onHandleClick = () => {
        this.setState({
            open: true,
        });
    };

    onClose = () => {
        this.setState({
            open: false,
        });
    };

    onChange = layout => {
        this.props.changeProfileLayout(layout);
    };

    // called by @listenLazy('resize')
    onResize = () => {
        this.setState({
            isMobile: window.innerWidth < FORCE_LINES_WIDTH,
        });
    };

    render() {
        const { open, isMobile } = this.state;

        return (
            <Fragment>
                <Handle innerRef={this.handle} onClick={this.onHandleClick}>
                    <IconStyled name={`layout_grid`} />
                </Handle>
                {open ? (
                    <LayoutSwitcherMenu
                        target={this.handle.current}
                        layouts={isMobile ? LAYOUTS.filter(layout => layout !== 'grid') : LAYOUTS}
                        onChange={this.onChange}
                        onClose={this.onClose}
                    />
                ) : null}
            </Fragment>
        );
    }
}
