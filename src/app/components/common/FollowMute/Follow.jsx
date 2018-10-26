import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Set, Map } from 'immutable';
import tt from 'counterpart';

import Button from 'golos-ui/Button';
import Icon from 'golos-ui/Icon';

import user from 'app/redux/User';
import transaction from 'app/redux/Transaction';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

const ButtonStyled = styled(Button)`
    margin-right: 8px;

    @media (max-width: 890px) {
        height: 30px;
    }
`;

const IconStyled = styled(Icon)`
    margin-right: 10px;
`;

class Follow extends Component {
    static propTypes = {
        following: PropTypes.string,
        follower: PropTypes.string, // OPTIONAL default to current user
        showFollow: PropTypes.bool,
        showMute: PropTypes.bool,
        children: PropTypes.any,
        showLogin: PropTypes.func.isRequired,
    };

    static defaultProps = { showFollow: true, showMute: true };

    state = { busy: false };

    handleUpdateFollow = type => {
        const { updateFollow, follower, following } = this.props;
        if (this.state.busy) return;

        this.setState({ busy: true });
        const done = () => this.setState({ busy: false });

        updateFollow(follower, following, type, done);
    };

    follow = () => this.handleUpdateFollow('blog');
    unfollow = () => this.handleUpdateFollow(null);
    ignore = () => this.handleUpdateFollow('ignore');
    unignore = () => this.handleUpdateFollow(null);

    followLoggedOut = e => {
        // close author preview if present
        const author_preview = document.querySelector('.dropdown-pane.is-open');
        if (author_preview) author_preview.remove();
        // resume authenticate modal
        this.props.showLogin(e);
    };

    render() {
        const { loading } = this.props;
        if (loading)
            return (
                <span>
                    <LoadingIndicator /> {tt('g.loading')}
                    &hellip;
                </span>
            );
        if (loading !== false) {
            // must know what the user is already following before any update can happen
            return null;
        }

        const { follower, following } = this.props; // html
        // Show follow preview for new users
        if (!follower || !following)
            return (
                <ButtonStyled onClick={this.followLoggedOut}>
                    <IconStyled name="plus" height="14" width="14" />
                    {tt('g.follow')}
                </ButtonStyled>
            );

        // Can't follow or ignore self
        if (follower === following) return null;

        const { showFollow, showMute, children, followingWhat } = this.props;
        const { busy } = this.state;

        return (
            <Fragment>
                {showFollow && followingWhat !== 'blog' ? (
                    <ButtonStyled disabled={busy} onClick={this.follow}>
                        <IconStyled name="plus" height="14" width="14" />
                        {tt('g.follow')}
                    </ButtonStyled>
                ) : (
                    <ButtonStyled disabled={busy} light onClick={this.unfollow}>
                        <IconStyled name="tick" height="10" width="14" />
                        {tt('g.unfollow')}
                    </ButtonStyled>
                )}

                {showMute && followingWhat !== 'ignore' ? (
                    <ButtonStyled disabled={busy} onClick={this.ignore}>
                        {tt('g.mute')}
                    </ButtonStyled>
                ) : (
                    <ButtonStyled disabled={busy} light onClick={this.unignore}>
                        {tt('g.unmute')}
                    </ButtonStyled>
                )}

                {children && (
                    <span>
                        &nbsp;&nbsp;
                        {children}
                    </span>
                )}
            </Fragment>
        );
    }
}

const emptyMap = Map();
const emptySet = Set();

export default connect(
    (state, ownProps) => {
        let { follower } = ownProps;
        if (!follower) {
            const current_user = state.user.get('current');
            follower = current_user ? current_user.get('username') : null;
        }

        const { following } = ownProps;
        const follow = state.global.getIn(['follow', 'getFollowingAsync', follower], emptyMap);
        const loading = follow.get('blog_loading', false) || follow.get('ignore_loading', false);
        const followingWhat = follow.get('blog_result', emptySet).contains(following)
            ? 'blog'
            : follow.get('ignore_result', emptySet).contains(following)
                ? 'ignore'
                : null;

        return {
            follower,
            following,
            followingWhat,
            loading,
        };
    },
    dispatch => ({
        updateFollow: (follower, following, action, done) => {
            const what = action ? [action] : [];
            const json = ['follow', { follower, following, what }];
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'custom_json',
                    operation: {
                        id: 'follow',
                        required_posting_auths: [follower],
                        json: JSON.stringify(json),
                    },
                    successCallback: done,
                    errorCallback: done,
                })
            );
        },
        showLogin: e => {
            if (e) e.preventDefault();
            dispatch(user.actions.showLogin());
        },
    })
)(Follow);
