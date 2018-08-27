import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { TabLink as StyledTabLink, TabLinkIndex as StyledTabLinkIndex } from 'golos-ui/Tab';
import Icon from 'golos-ui/Icon';

import Container from 'src/app/components/common/Container';
import { changeProfileLayout } from 'src/app/redux/actions/ui';
import * as ReactDOM from 'react-dom';

const Wrapper = styled.div`
    position: relative;
    min-height: 50px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    z-index: 1;
`;

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

const SettingsIcon = styled(Icon)``;

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
    color: ${a => (a.active ? '#393636' : '#b7b7b9')};
    transition: color 0.15s;

    &:hover {
        color: #393636;
    }
`;

const SimpleIcon = Icon.extend`
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
        changeProfileLayout: PropTypes.func,
    };

    componentDidUpdate() {
        for (let key in this.itemsRef) {
            let item = this.itemsRef[key];
            if (!item) {
                continue;
            }
            console.log(ReactDOM.findDOMNode(item).clientWidth);
        }
        console.log('____');
    }

    componentDidMount() {
        this._checkScreenSize();
        window.addEventListener('resize', this._checkScreenSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._checkScreenSize);
    }

    itemsRef = {};

    render() {
        const { accountName, isOwner, className } = this.props;
        const indexTabLink = { value: tt('g.blog'), to: `/@${accountName}` };

        const tabLinks = [];

        tabLinks.push({ value: tt('g.comments'), to: `/@${accountName}/comments` });

        if (isOwner) {
            tabLinks.push({ value: 'Избранное', to: `/@${accountName}/favorites` });
        }

        tabLinks.push(
            { value: tt('g.replies'), to: `/@${accountName}/recent-replies` },
            { value: tt('g.wallet'), to: `/@${accountName}/transfers` }
        );

        if (isOwner) {
            tabLinks.push({ value: 'Активность', to: `/@${accountName}/activity` });
        }

        const rewardsMenu = [
            {
                link: `/@${accountName}/curation-rewards`,
                value: tt('g.curation_rewards'),
            },
            {
                link: `/@${accountName}/author-rewards`,
                value: tt('g.author_rewards'),
            },
        ];
        return (
            <Wrapper className={className} innerRef={ref => (this.wrapper = ref)}>
                <Container align="center" wrap="wrap" ref={ref => (this.container = ref)}>
                    <TabLinkIndex key={indexTabLink.to} to={indexTabLink.to}>
                        {indexTabLink.value}
                    </TabLinkIndex>
                    {tabLinks.map(({ value, to }) => (
                        <TabLink key={to} to={to} ref={ref => (this.itemsRef[to] = ref)}>
                            {value}
                        </TabLink>
                    ))}
                    {/*<LinkWithDropdown*/}
                    {/*closeOnClickOutside*/}
                    {/*dropdownPosition="bottom"*/}
                    {/*dropdownContent={<VerticalMenu items={rewardsMenu} />}*/}
                    {/*>*/}
                    {/*<TabLink>{tt('g.rewards')}</TabLink>*/}
                    {/*</LinkWithDropdown>*/}
                    {this._renderRightIcons()}
                </Container>
            </Wrapper>
        );
    }

    _renderRightIcons() {
        const { accountName, isOwner, layout, showLayout } = this.props;

        const icons = [];

        if (showLayout && !this.state.screenLessThenMainContainer) {
            icons.push(
                <IconWrap
                    key="l-list"
                    active={layout === 'list'}
                    data-tooltip="Список"
                    onClick={this._onListClick}
                    ref={ref => (this.itemsRef['list'] = ref)}
                >
                    <SimpleIcon name="layout_list" />
                </IconWrap>,
                <IconWrap
                    key="l-grid"
                    active={layout === 'grid'}
                    data-tooltip="Сетка"
                    onClick={this._onGridClick}
                    ref={ref => (this.itemsRef['grid'] = ref)}
                >
                    <SimpleIcon name="layout_grid" />
                </IconWrap>
            );
        }

        if (isOwner) {
            icons.push(
                <IconLink
                    key="settings"
                    to={`/@${accountName}/settings`}
                    data-tooltip={tt('g.settings')}
                    ref={ref => (this.itemsRef['settings'] = ref)}
                >
                    <SettingsIcon name="setting" size="24" />
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
        const wrapperWidth = this.wrapper.clientWidth;
        if (
            wrapperWidth <= this.props.MAIN_CONTAINER_WIDTH_POINT &&
            !this.state.screenLessThenMainContainer
        ) {
            this.setState({ screenLessThenMainContainer: true });
        }
        if (wrapperWidth <= this.props.MAIN_CONTAINER_WIDTH_POINT && this.props.layout !== 'grid') {
            this.props.changeProfileLayout('grid');
        }
        if (
            wrapperWidth > this.props.MAIN_CONTAINER_WIDTH_POINT &&
            this.state.screenLessThenMainContainer
        ) {
            this.setState({ screenLessThenMainContainer: false });
        }
    };
}

export default connect(
    state => {
        const MAIN_CONTAINER_WIDTH_POINT = 1199;
        return {
            MAIN_CONTAINER_WIDTH_POINT,
            layout: (state.ui.profile && state.ui.profile.get('layout')) || 'list',
        };
    },
    {
        changeProfileLayout,
    }
)(UserNavigation);
