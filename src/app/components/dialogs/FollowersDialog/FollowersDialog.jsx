import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';
import throttle from 'lodash/throttle';
import tt from 'counterpart';

import normalizeProfile from 'app/utils/NormalizeProfile';

import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import Avatar from 'src/app/components/common/Avatar';
import Follow from 'src/app/components/common/Follow';
import {
    Dialog,
    Header,
    Title,
    IconClose,
    Content,
    UserItem,
    UserLink,
    Name,
    LoaderWrapper,
} from 'src/app/components/dialogs/common/Dialog';

export default class FollowersDialog extends PureComponent {
    static propTypes = {
        // external
        pageAccountName: PropTypes.string,
        type: PropTypes.string,

        // connect
        loading: PropTypes.bool,
        followCount: PropTypes.number,
        users: PropTypes.instanceOf(Set),
        getFollowers: PropTypes.func,
        getFollowing: PropTypes.func,
    };

    rootRef = null;
    lastUserName = '';

    componentDidMount() {
        this.props.dialogRoot.addEventListener('scroll', this.handleScroll);
        this.loadMore();
    }

    componentWillUnmount() {
        this.props.dialogRoot.removeEventListener('scroll', this.handleScroll);
        this.handleScroll.cancel();
    }

    setRootRef = el => (this.rootRef = el);

    handleScroll = throttle(() => {
        const { loading } = this.props;

        if (!loading) {
            const rect = this.rootRef.getBoundingClientRect();
            if (rect.top + rect.height < window.innerHeight * 1.5) {
                this.loadMore();
            }
        }
    }, 1000);

    loadMore = () => {
        const { pageAccountName, users, type } = this.props;

        const lastUser = users && users.last(null);
        const startUserName = (lastUser && lastUser.get('name')) || '';

        if (!this.lastUserName || this.lastUserName !== startUserName) {
            if (type === 'follower') {
                this.props.getFollowers({
                    following: pageAccountName,
                    startFollower: startUserName,
                });
            } else {
                this.props.getFollowing({
                    follower: pageAccountName,
                    startFollowing: startUserName,
                });
            }
        }

        this.lastUserName = startUserName;
    };

    renderUser = user => {
        const profile = normalizeProfile(user.toJS());

        return (
            <UserItem key={user.get('name')}>
                <UserLink
                    to={`/@${user.get('name')}`}
                    title={user.get('name')}
                    onClick={this.props.onClose}
                >
                    <Avatar avatarUrl={profile.profile_image} />
                    <Name>{profile.name || user.get('name')}</Name>
                </UserLink>
                <Follow following={user.get('name')} collapseOnMobile />
            </UserItem>
        );
    };

    render() {
        const { loading, followCount, users, type } = this.props;

        return (
            <Dialog>
                <Header>
                    <Title>{tt(`user_profile.${type}_count`, { count: followCount })}</Title>
                    <IconClose onClick={this.props.onClose} />
                </Header>
                <Content innerRef={this.setRootRef}>
                    {users.map(this.renderUser)}
                    {loading && (
                        <LoaderWrapper>
                            <LoadingIndicator type="circle" size={40} />
                        </LoaderWrapper>
                    )}
                </Content>
            </Dialog>
        );
    }
}
