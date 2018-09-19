import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { TabLink as StyledTabLink, TabLinkIndex as StyledTabLinkIndex } from 'golos-ui/Tab';

import SlideContainer from 'src/app/components/common/SlideContainer';

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

@connect(state => ({
    myAccountName: state.user.getIn(['current', 'username']),
}))
export default class Navigation extends PureComponent {
    static propTypes = {
        myAccountName: PropTypes.string,
    };

    render() {
        const { myAccountName, className } = this.props;

        const tabLinks = [];

        if (myAccountName) {
            tabLinks.push({ value: tt('header_jsx.home'), to: `/@${myAccountName}/feed` });
        }

        tabLinks.push({ value: tt('g.new'), to: '/created' });
        tabLinks.push({ value: tt('main_menu.hot'), to: '/hot' });
        tabLinks.push({ value: tt('main_menu.trending'), to: '/trending' });
        tabLinks.push({ value: tt('g.promoted'), to: '/promoted' });

        return (
            <SlideContainer className={className}>
                {tabLinks.map(({ value, to }) => (
                    <TabLinkIndex key={to} to={to}>
                        {value}
                    </TabLinkIndex>
                ))}
            </SlideContainer>
        );
    }
}
