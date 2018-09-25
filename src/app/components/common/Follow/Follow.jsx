import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import is from 'styled-is';

import tt from 'counterpart';

import { followSelector } from 'src/app/redux/selectors/follow/follow';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { updateFollow } from 'src/app/redux/actions/follow';

import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';

const Wrapper = styled(Button)`
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;

    ${is('auto')`
        min-width: 100%;
    `}
`;

@connect(
    (state, props) => ({
        ...followSelector(state, props),
        username: currentUsernameSelector(state),
    }),
    (dispatch, { following }) => ({
        updateFollow: (follower, action) => {
            dispatch(updateFollow(follower, following, action));
        },
    })
)
export default class Follow extends Component {

    static propTypes = {
        following: PropTypes.string.isRequired,
        auto: PropTypes.bool,
        onClick: PropTypes.func,

        username: PropTypes.string,
        isFollow: PropTypes.bool,
    };

    static defaultProps = {
        onClick: () => {},
    };

    follow = e => {
        this.props.updateFollow(this.props.username, 'blog');
        this.props.onClick(e);
    };

    unfollow = async e => {
        if (await DialogManager.confirm()) {
            this.props.updateFollow(this.props.username, null);
            this.props.onClick(e);
        }
    };

    render() {
        const { auto, isFollow } = this.props;
        return isFollow ? (
            <Wrapper auto={auto} light onClick={this.unfollow}>
                <Icon width="10" height="10" name="cross" />
                {tt('g.unfollow')}
            </Wrapper>
        ) : (
            <Wrapper auto={auto} onClick={this.follow}>
                <Icon width="11" height="8" name="subscribe" />
                {tt('g.follow')}
            </Wrapper>
        );
    }
}
