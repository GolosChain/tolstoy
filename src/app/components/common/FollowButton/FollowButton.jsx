import React, { Component } from 'react';
import tt from 'counterpart';
import Icon from '../../golos-ui/Icon';
import Button from '../../golos-ui/Button';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authorSelector } from '../../../redux/selectors/post/post';
import { currentUserSelector } from '../../../redux/selectors/common';
import { updateFollow } from '../../../redux/actions/follow';

const Wrapper = Button.extend`
    min-width: 100%;
    min-height: 100%;
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;
`;

class FollowButton extends Component {
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

    _follow = e => {
        this.props.updateFollow(this.props.username, 'blog');
        this.props.onClick(e);
    };

    _unfollow = e => {
        this.props.updateFollow(this.props.username, null);
        this.props.onClick(e);
    };
}

const mapStateToProps = (state, props) => {
    const author = authorSelector(state, props);
    return {
        isFollow: author.isFollow,
        username: currentUserSelector(state).get('username'),
    };
};

const mapDispatchToProps = (dispatch, { following }) => {
    return {
        updateFollow: (follower, action) => {
            dispatch(updateFollow(follower, following, action));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FollowButton);
