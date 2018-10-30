import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';
import styled from 'styled-components';
import is from 'styled-is';
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

const StyledDialog = styled(Dialog)`
    ${is('hideContent')`
        @media (max-width: 768px) {
            position: relative;
    
            max-height: calc(100vh - 80px);
            overflow: hidden;
        }
    `};
`;

const ShowAll = styled.div`
    display: none;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 17px 0;

    border-radius: 0 0 8px 8px;
    box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.15);
    background-color: #ffffff;

    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #111111;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
        color: #2879ff;
    }

    @media (max-width: 768px) {
        display: ${({ hideContent }) => (hideContent ? 'block' : 'none')};
    }
`;

const StyledLoaderWrapper = styled(LoaderWrapper)`
    @media (max-width: 768px) {
        align-items: ${({ hideContent }) => (hideContent ? 'flex-start' : 'center')};
    }
`;

export default class FollowersDialog extends PureComponent {
    static propTypes = {
        // external
        pageAccountName: PropTypes.string,
        type: PropTypes.string,

        // external dialog
        onRef: PropTypes.func.isRequired,

        // connect
        loading: PropTypes.bool,
        followCount: PropTypes.number,
        users: PropTypes.instanceOf(Set),
        getFollowers: PropTypes.func,
        getFollowing: PropTypes.func,
    };

    state = {
        showAll: false,
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

    showAll = () => {
        this.setState({ showAll: true });
    };

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
        const { showAll } = this.state;
        const { loading, followCount, users, type } = this.props;

        return (
            <StyledDialog hideContent={!showAll}>
                <Header>
                    <Title>{tt(`user_profile.${type}_count`, { count: followCount })}</Title>
                    <IconClose onClick={this.props.onClose} />
                </Header>
                <Content innerRef={this.setRootRef}>
                    {users.map(this.renderUser)}
                    {loading && (
                        <StyledLoaderWrapper hideContent={!showAll}>
                            <LoadingIndicator type="circle" size={40} />
                        </StyledLoaderWrapper>
                    )}
                </Content>
                <ShowAll onClick={this.showAll} hideContent={!showAll}>
                    {tt('dialog.show_all')}
                </ShowAll>
            </StyledDialog>
        );
    }
}
