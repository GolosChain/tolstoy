import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { TabLink } from 'golos-ui/Tab';
import SlideContainer from 'src/app/components/common/SlideContainer';

const TabLinkStyled = styled(TabLink)`
    padding: 0 12px;

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

        tabLinks.push(
            { value: tt('g.new'), to: '/created' },
            { value: tt('main_menu.hot'), to: '/hot' },
            { value: tt('main_menu.trending'), to: '/trending' },
            { value: tt('g.promoted'), to: '/promoted' }
        );

        return (
            <SlideContainer className={className}>
                {tabLinks.map(({ value, to }) => (
                    <TabLinkStyled key={to} to={to}>
                        {value}
                    </TabLinkStyled>
                ))}
            </SlideContainer>
        );
    }
}
