import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 5px;
    cursor: pointer;
    transition: transform 0.15s;

    &:hover {
        transform: scale(1.15);
    }
`;

const ActionIcon = styled(Icon)`
    flex-shrink: 0;
`;

export class ReBlog extends Component {
    static propTypes = {
        contentLink: PropTypes.string.isRequired,
    };

    reBlog = () => {
        const { contentLink, openReBlogDialog } = this.props;
        openReBlogDialog(contentLink);
    };

    render() {
        const { isOwner } = this.props;

        return (
            <Fragment>
                {isOwner ? null : (
                    <Wrapper
                        onClick={this.reBlog}
                        role="button"
                        data-tooltip={tt('g.reblog')}
                        aria-label={tt('g.reblog')}
                    >
                        <ActionIcon width="20" height="20" name="repost" />
                    </Wrapper>
                )}
            </Fragment>
        );
    }
}
