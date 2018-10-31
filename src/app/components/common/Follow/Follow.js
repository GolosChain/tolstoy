import React, { Component } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';

const IconStyled = styled(Icon)`
    margin-right: 6px;
`;

const Wrapper = styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 165px;

    font-size: 12px;
    font-weight: bold;
    line-height: 23px;

    span {
        margin-top: 1px;
    }

    ${is('collapseOnMobile')`
        @media (max-width: 500px) {
            width: 34px;
            height: 34px;
            min-width: 0;
            border-radius: 50%;
    
            ${IconStyled} {
                min-width: 12px;
                min-height: 12px;
                margin: 0;
            };
    
            span {
                display: none;
            }
        }
    `};
`;

export default class Follow extends Component {
    static propTypes = {
        // external
        following: PropTypes.string.isRequired,
        collapseOnMobile: PropTypes.bool,
        onClick: PropTypes.func,

        // connect
        username: PropTypes.string,
        isFollow: PropTypes.bool,
    };

    static defaultProps = {
        collapseOnMobile: false,
        onClick: () => {},
    };

    follow = e => {
        const { username, following, updateFollow, onClick } = this.props;
        updateFollow(username, following, 'blog');
        onClick(e);
    };

    unfollow = e => {
        const { following, onClick, confirmUnfollowDialog } = this.props;
        confirmUnfollowDialog(following);
        onClick(e);
    };

    render() {
        const { collapseOnMobile, isFollow, className } = this.props;

        if (isFollow) {
            return (
                <Wrapper
                    light
                    collapseOnMobile={collapseOnMobile}
                    onClick={this.unfollow}
                    className={className}
                >
                    <IconStyled width="14" height="10" name="tick" />
                    <span>{tt('g.subscriptions')}</span>
                </Wrapper>
            );
        }

        return (
            <Wrapper
                collapseOnMobile={collapseOnMobile}
                onClick={this.follow}
                className={className}
            >
                <IconStyled width="14" height="14" name="plus" />
                <span>{tt('g.follow')}</span>
            </Wrapper>
        );
    }
}
