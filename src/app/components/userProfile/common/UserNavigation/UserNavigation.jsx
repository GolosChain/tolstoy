import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import { Link } from 'react-router';

import { TabLink, TabLinkIndex } from 'golos-ui/Tab';
import Icon from 'golos-ui/Icon';

import SlideContainer from 'src/app/components/common/SlideContainer';
import LayoutSwitcher from 'src/app/components/common/LayoutSwitcher';
import {
    MAX_WIDTH,
    BASE_MARGIN,
    MOBILE_WIDTH,
    MOBILE_MARGIN,
} from 'src/app/components/common/Container';

const SlideContainerStyled = styled(SlideContainer)`
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const Container = styled.div`
    flex: 1 0;
    max-width: ${MAX_WIDTH}px;
    margin: 0 auto;

    @media (max-width: ${MAX_WIDTH + BASE_MARGIN * 2}px) {
        padding: 0 ${BASE_MARGIN}px;
        margin: 0;
    }

    @media (max-width: ${MOBILE_WIDTH}px) {
        padding: 0 ${MOBILE_MARGIN}px;
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

export default class UserNavigation extends PureComponent {
    static propTypes = {
        accountName: PropTypes.string,
        isOwner: PropTypes.bool,
        showLayout: PropTypes.bool,
    };

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
        const { accountName, isOwner, showLayout } = this.props;

        return (
            <RightIcons>
                {showLayout ? <LayoutSwitcher /> : null}
                {isOwner ? (
                    <IconLink
                        key="settings"
                        to={`/@${accountName}/settings`}
                        role="button"
                        aria-label={tt('g.settings')}
                        data-tooltip={tt('g.settings')}
                    >
                        <Icon name="settings" size="24" />
                    </IconLink>
                ) : null}
            </RightIcons>
        );
    }
}
