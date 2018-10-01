import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Set } from 'immutable';
import styled from 'styled-components';
import { Link } from 'react-router';
import throttle from 'lodash/throttle';
import tt from 'counterpart';

import o2j from 'shared/clash/object2json';
import normalizeProfile from 'app/utils/NormalizeProfile';
import { followersDialogSelector } from 'src/app/redux/selectors/dialogs/followersDialog';
import { getFollowers, getFollowing } from 'src/app/redux/actions/followers';

import Icon from 'golos-ui/Icon';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import Avatar from 'src/app/components/common/Avatar';
import Follow from 'src/app/components/common/Follow';

const Dialog = styled.div`
    position: relative;
    flex-basis: 800px;
    color: #333;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 19px 3px rgba(0, 0, 0, 0.2);
`;

const IconClose = styled(Icon).attrs({
    name: 'cross',
})`
    position: absolute;
    right: 8px;
    top: 8px;
    width: 30px;
    height: 30px;
    padding: 8px;
    text-align: center;
    color: #e1e1e1;
    cursor: pointer;
    transition: color 0.1s;

    &:hover {
        color: #000;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    border-radius: 8px 8px 0 0;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const Title = styled.div`
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
`;

const Content = styled.div`
    position: relative;
    padding: 20px;
`;

const UserItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;

    &:first-child {
        margin-top: 0;
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const UserLink = styled(Link)`
    display: flex;
    align-items: center;
`;

const Name = styled.div`
    color: #393636;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.4px;
    line-height: 18px;
    margin-left: 9px;
`;

const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90px;
    opacity: 0;
    animation: fade-in 0.25s forwards;
    animation-delay: 0.25s;
`;

@connect(
    followersDialogSelector,
    {
        getFollowers,
        getFollowing,
    }
)
export default class FollowersDialog extends PureComponent {
    static propTypes = {
        pageAccountName: PropTypes.string,
        type: PropTypes.string,

        onRef: PropTypes.func.isRequired,

        loading: PropTypes.bool,
        followCount: PropTypes.number,
        users: PropTypes.instanceOf(Set),
        getFollowers: PropTypes.func,
        getFollowing: PropTypes.func,
    };

    rootRef = null;
    lastUserName = '';

    componentDidMount() {
        this.props.onRef(this);
        this.props.dialogRoot.addEventListener('scroll', this.handleScroll);
        this.loadMore();
    }

    componentWillUnmount() {
        this.props.onRef(null);
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

    render() {
        const { loading, followCount, users, type } = this.props;

        return (
            <Dialog>
                <IconClose onClick={this.props.onClose} />
                <Header>
                    <Title>{tt(`user_profile.${type}_count`, { count: followCount })}</Title>
                </Header>
                <Content innerRef={this.setRootRef}>
                    {users.map(user => {
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
                                <Follow following={user.get('name')} />
                            </UserItem>
                        );
                    })}
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
