import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { followSelector } from 'src/app/redux/selectors/follow/follow';
import { updateFollow } from 'src/app/redux/actions/follow';

const Wrapper = styled(Button)`
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;

    span {
        margin-top: 1px;
    }
`;

const IconStyled = styled(Icon)`
    margin-right: 6px;
`;

@connect(
    (state, props) => {
        return {
            ...followSelector(state, props),
            username: currentUsernameSelector(state),
        };
    },
    (dispatch, { following }) => {
        return {
            updateFollow: (follower, action) => {
                dispatch(updateFollow(follower, following, action));
            },
        };
    }
)
export default class Follow extends Component {
    static propTypes = {
        following: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    };
    static defaultProps = {
        onClick: () => {},
    };

    render() {
        const { isFollow, className } = this.props;
        return isFollow ? (
            <Wrapper light onClick={this._unfollow} className={className}>
                <IconStyled width="10" height="10" name="cross" />
                <span>{tt('g.unfollow')}</span>
            </Wrapper>
        ) : (
            <Wrapper onClick={this._follow} className={className}>
                <IconStyled width="11" height="8" name="subscribe" />
                <span>{tt('g.follow')}</span>
            </Wrapper>
        );
    }

    _follow = e => {
        this.props.updateFollow(this.props.username, 'blog');
        this.props.onClick(e);
    };

    _unfollow = e => {
        this.props.updateFollow(this.props.username, null);
        this.props.onClick(e);
    };
}
