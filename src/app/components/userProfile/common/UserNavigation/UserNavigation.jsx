import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import throttle from 'lodash/throttle';

import { TabLink, TabLinkIndex } from 'golos-ui/Tab';
import Icon from 'golos-ui/Icon';

import { changeProfileLayout } from 'src/app/redux/actions/ui';
import SlideContainer from 'src/app/components/common/SlideContainer';
import { MAX_WIDTH, OFFSET } from 'src/app/components/common/Container/Container';
import { FORCE_LINES_WIDTH } from 'src/app/components/common/CardsList/CardsList';

const SlideContainerStyled = styled(SlideContainer)`
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const Container = styled.div`
    display: flex;
    flex-grow: 1;
    max-width: ${MAX_WIDTH}px;
    margin: 0 auto;

    @media (max-width: ${MAX_WIDTH + OFFSET * 2}px) {
        padding: 0 ${OFFSET - 4}px;
        margin: 0;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-grow: 1;
    margin: 0 -3px;
`;

const TabLinkStyled = styled(TabLink)`
    height: 50px;

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
TabLinkStyled.defaultProps = {
    activeClassName: 'active',
};

const TabLinkIndexStyled = TabLinkStyled.withComponent(TabLinkIndex);

const RightIcons = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
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

        //tabLinks.push({ value: tt('g.messages'), to: `/@${accountName}/messages` });

        return (
            <SlideContainerStyled className={className}>
                <Container>
                    <Wrapper>
                        {tabLinks.map(({ value, to }) => (
                            <TabLinkIndexStyled key={to} to={to}>
                                {value}
                            </TabLinkIndexStyled>
                        ))}
                        {this._renderRightIcons()}
                    </Wrapper>
                </Container>
            </SlideContainerStyled>
        );
    }

    _renderRightIcons() {
        const { accountName, isOwner, layout, showLayout } = this.props;
        const { isMobile } = this.state;

        const icons = [];

        if (showLayout && !isMobile) {
            if (layout === 'list') {
                icons.push(
                    <IconWrap
                        key="l-grid"
                        role="button"
                        aria-label={tt('data-tooltip.grid')}
                        data-tooltip={tt('data-tooltip.grid')}
                        onClick={this._onGridClick}
                    >
                        <SimpleIcon name="layout_grid" />
                    </IconWrap>
                );
            } else {
                icons.push(
                    <IconWrap
                        key="l-list"
                        role="button"
                        aria-label={tt('data-tooltip.list')}
                        data-tooltip={tt('data-tooltip.list')}
                        onClick={this._onListClick}
                    >
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
                    role="button"
                    aria-label={tt('g.settings')}
                    data-tooltip={tt('g.settings')}
                >
                    <Icon name="settings" size="24" />
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
            isMobile: window.innerWidth < FORCE_LINES_WIDTH,
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
