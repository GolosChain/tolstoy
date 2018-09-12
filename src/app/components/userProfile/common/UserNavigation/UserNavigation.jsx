import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { TabLink as StyledTabLink, TabLinkIndex as StyledTabLinkIndex } from 'golos-ui/Tab';
import Icon from 'golos-ui/Icon';

import { changeProfileLayout } from 'src/app/redux/actions/ui';
import SlideContainer from 'src/app/components/common/SlideContainer';
import throttle from 'lodash/throttle';

const MAIN_CONTAINER_WIDTH_POINT = 1200;

const TabLink = styled(StyledTabLink)`
    &.${({ activeClassName }) => activeClassName} {
        :after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: #333;
        }
    }
`;
TabLink.defaultProps = {
    activeClassName: 'active',
};

const TabLinkIndex = TabLink.withComponent(StyledTabLinkIndex);

const RightIcons = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
`;

const IconLink = styled(Link)`
    display: flex;
    padding: 4px;
    color: #b7b7b9;

    &.${({ activeClassName }) => activeClassName}, &:hover {
        color: #2879ff;
    }
`;
IconLink.defaultProps = {
    activeClassName: 'active',
};

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

class UserNavigation extends PureComponent {
    constructor() {
        super();
        this.state = {
            screenLessThenMainContainer: false,
        };
    }
    static propTypes = {
        accountName: PropTypes.string,
        isOwner: PropTypes.bool,
        showLayout: PropTypes.bool,
        layout: PropTypes.oneOf(['list', 'grid']).isRequired,
        changeProfileLayout: PropTypes.func.isRequired,
    };

    state = {
        isMobile: false,
    };

    componentDidMount() {
        this._checkScreenSize();
        window.addEventListener('resize', this._checkScreenSizeLazy);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._checkScreenSizeLazy);
        this._checkScreenSizeLazy.cancel();
    }

    componentDidMount() {
        this._checkScreenSize();
        window.addEventListener('resize', this._checkScreenSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._checkScreenSize);
    }

    render() {
        const { accountName, isOwner, className } = this.props;

        const tabLinks = [];

        tabLinks.push({ value: tt('g.blog'), to: `/@${accountName}` });
        tabLinks.push({ value: tt('g.comments'), to: `/@${accountName}/comments` });

        if (isOwner) {
            tabLinks.push({ value: tt('g.favorites'), to: `/@${accountName}/favorites` });
        }

        tabLinks.push(
            { value: tt('g.replies'), to: `/@${accountName}/recent-replies` },
            { value: tt('g.wallet'), to: `/@${accountName}/transfers` }
        );

        if (isOwner) {
            tabLinks.push({ value: tt('g.activity'), to: `/@${accountName}/activity` });
        }

        return (
            <SlideContainer className={className}>
                {tabLinks.map(({ value, to }) => (
                    <TabLinkIndex key={to} to={to}>
                        {value}
                    </TabLinkIndex>
                ))}
                {this._renderRightIcons()}
            </SlideContainer>
        );
    }

    _renderRightIcons() {
        const { accountName, isOwner, layout, showLayout } = this.props;
        const { isMobile } = this.state;

        const icons = [];

        if (showLayout && !isMobile) {
            if (layout === 'list') {
                icons.push(
                    <IconWrap key="l-grid" data-tooltip="Сетка" onClick={this._onGridClick}>
                        <SimpleIcon name="layout_grid" />
                    </IconWrap>
                );
            } else {
                icons.push(
                    <IconWrap key="l-list" data-tooltip="Список" onClick={this._onListClick}>
                        <SimpleIcon name="layout_list" />
                    </IconWrap>
                );
            }
        }

        if (isOwner) {
            icons.push(
                <IconLink
                    key="settings"
                    to={`/@${accountName}/settings`}
                    data-tooltip={tt('g.settings')}
                >
                    <Icon name="setting" size="24" />
                </IconLink>
            );
        }

        if (icons.length) {
            return <RightIcons>{icons}</RightIcons>;
        }
    }

    _onGridClick = () => {
        this.props.changeProfileLayout('grid');
    };

    _onListClick = () => {
        this.props.changeProfileLayout('list');
    };

    _checkScreenSize = () => {
        this.setState({
            isMobile: window.innerWidth < MAIN_CONTAINER_WIDTH_POINT,
        });
    };

    _checkScreenSizeLazy = throttle(this._checkScreenSize, 50);
}

export default connect(
    state => ({
        layout: (state.ui.profile && state.ui.profile.get('layout')) || 'list',
    }),
    {
        changeProfileLayout,
    }
)(UserNavigation);
