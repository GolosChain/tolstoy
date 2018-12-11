import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import { Link } from 'react-router';

import LayoutSwitcher from 'src/app/components/common/LayoutSwitcher';
import Navigation from 'src/app/components/common/Navigation';

const IconLink = styled(Link)`
    display: flex;
    padding: 4px;
    margin-left: 7px;
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
            tabLinks.push(
                { value: tt('g.activity'), to: `/@${accountName}/activity` },
                { value: tt('g.settings'), to: `/@${accountName}/settings` }
                // { value: tt('g.messages'), to: `/@${accountName}/messages` },
            );
        }

        return (
            <Navigation
                tabLinks={tabLinks}
                compact
                rightItems={this.renderRightIcons()}
                className={className}
            />
        );
    }

    renderRightIcons() {
        const { showLayout } = this.props;

        return <Fragment>{showLayout ? <LayoutSwitcher /> : null}</Fragment>;
    }
}
