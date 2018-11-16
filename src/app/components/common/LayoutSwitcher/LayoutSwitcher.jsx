import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import { FORCE_LINES_WIDTH } from 'src/app/components/common/CardsList/CardsList';

const IconWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 32px;
    margin-right: 15px;
    cursor: pointer;
    color: #b7b7b9;
    transition: color 0.15s;

    &:hover {
        color: #393636;
    }
`;

const SimpleIcon = styled(Icon)`
    width: 20px;
    height: 20px;
`;

export default class LayoutSwitcher extends PureComponent {
    static propTypes = {
        layout: PropTypes.oneOf(['list', 'grid']).isRequired,
        changeProfileLayout: PropTypes.func.isRequired,
    };

    state = {
        isMobile: false,
    };

    componentDidMount() {
        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSizeLazy);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkScreenSizeLazy);
        this.checkScreenSizeLazy.cancel();
    }

    checkScreenSize = () => {
        this.setState({
            isMobile: window.innerWidth < FORCE_LINES_WIDTH,
        });
    };

    checkScreenSizeLazy = throttle(this.checkScreenSize, 50);

    onGridClick = () => {
        this.props.changeProfileLayout('grid');
    };

    onListClick = () => {
        this.props.changeProfileLayout('list');
    };

    render() {
        const { layout } = this.props;
        const { isMobile } = this.state;

        if (isMobile) {
            return null;
        }

        if (layout === 'list') {
            return (
                <IconWrap
                    key="l-grid"
                    role="button"
                    aria-label={tt('data-tooltip.grid')}
                    data-tooltip={tt('data-tooltip.grid')}
                    onClick={this.onGridClick}
                >
                    <SimpleIcon name="layout_grid" />
                </IconWrap>
            );
        } else {
            return (
                <IconWrap
                    key="l-list"
                    role="button"
                    aria-label={tt('data-tooltip.list')}
                    data-tooltip={tt('data-tooltip.list')}
                    onClick={this.onListClick}
                >
                    <SimpleIcon name="layout_list" />
                </IconWrap>
            );
        }
    }
}
