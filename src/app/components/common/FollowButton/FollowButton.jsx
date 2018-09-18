import React, { Component } from 'react';
import tt from 'counterpart';
import Icon from '../../golos-ui/Icon';
import Button from '../../golos-ui/Button';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authorSelector } from '../../../redux/selectors/post/post';
import transaction from '../../../../../app/redux/Transaction';
import { currentUserSelector } from '../../../redux/selectors/common';

const Wrapper = Button.extend`
    min-width: 100%;
    min-height: 100%;
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;
`;

class FollowButton extends Component {
    render() {
        const { isFollow, className } = this.props;
        return isFollow ? (
            <Wrapper light onClick={this._unfollow} className={className}>
                <Icon width="10" height="10" name="cross" />
                {tt('g.unfollow')}
            </Wrapper>
        ) : (
            <Wrapper onClick={this._follow} className={className}>
                <Icon width="11" height="8" name="subscribe" />
                {tt('g.follow')}
            </Wrapper>
        );
    }

    _follow = () => {
        this.props.updateFollow(this.props.username, 'blog');
    };
    _unfollow = () => {
        this.props.updateFollow(this.props.username, null);
    };
}

FollowButton.propTypes = {
    following: PropTypes.string.isRequired,
};

const mapStateToProps = (state, props) => {
    const author = authorSelector(state, props);
    return {
        isFollow: author.isFollow,
        username: currentUserSelector(state).get('username'),
    };
};

const mapDispatchToProps = (dispatch, { following }) => {
    return {
        updateFollow: (follower, action, done) => {
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
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FollowButton);
