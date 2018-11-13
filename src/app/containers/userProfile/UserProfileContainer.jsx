import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import is from 'styled-is';
import { Map } from 'immutable';
import { last } from 'ramda';
import tt from 'counterpart';
import { Helmet } from 'react-helmet';

import { blockedUsers, blockedUsersContent } from 'app/utils/IllegalContent';

import user from 'app/redux/User';
import transaction from 'app/redux/Transaction';
import { showNotification } from 'src/app/redux/actions/ui';

import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import IllegalContentMessage from 'app/components/elements/IllegalContentMessage';
import Container from 'src/app/components/common/Container';
import UserHeader from 'src/app/components/userProfile/common/UserHeader';
import UserNavigation from 'src/app/components/userProfile/common/UserNavigation';
import UserCardAbout from 'src/app/components/userProfile/common/UserCardAbout';
import { FAVORITES_LOAD } from 'src/app/redux/constants/favorites';

const Main = styled(Container).attrs({
    align: 'flex-start',
    justify: 'center',
    small: 1,
})`
    padding: 20px 0;

    @media (max-width: 890px) {
        padding-top: 0;
    }
`;

const WrapperMain = styled.div`
    background: #f9f9f9;

    @media (max-width: 890px) {
        background: #f3f3f3;
    }
`;

const Content = styled.div`
    flex-shrink: 1;
    flex-grow: 1;
    min-width: 280px;

    ${is('center')`
        flex-shrink: 0;
        flex-grow: 0;
    `};

    @media (max-width: 890px) {
        order: 4;
        max-width: none;
    }
`;

const SidebarLeft = styled.div`
    width: 273px;
    flex-shrink: 0;
    margin-right: 18px;

    @media (max-width: 890px) {
        width: 100%;
        margin-left: 0;
        order: 1;
    }
`;

const BigUserNavigation = styled(UserNavigation)`
    @media (max-width: 890px) {
        display: none;
    }
`;

const SmallUserNavigation = styled(UserNavigation)`
    display: none;

    @media (max-width: 890px) {
        display: block;
        order: 3;
        margin-bottom: 16px;
    }
`;

@connect(
    (state, props) => {
        const accountName = props.params.accountName.toLowerCase();

        const currentUser = state.user.get('current') || Map();
        const currentAccount = state.global.getIn(['accounts', accountName]);

        const fetching = state.app.get('loading');
        const isOwner = currentUser.get('username') === accountName;

        const followerCount = state.global.getIn(
            ['follow_count', accountName, 'follower_count'],
            0
        );

        const followingCount = state.global.getIn(
            ['follow_count', accountName, 'following_count'],
            0
        );

        return {
            pageAccountName: accountName,
            currentUser,
            currentAccount,

            fetching,
            isOwner,

            followerCount,
            followingCount,
        };
    },
    dispatch => ({
        fetchFollowCount: () => dispatch(fetchFollowCount),
        uploadImage: (file, progress) => {
            dispatch({
                type: 'user/UPLOAD_IMAGE',
                payload: { file, progress },
            });
        },
        updateAccount: ({ successCallback, errorCallback, ...operation }) => {
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'account_metadata',
                    operation,
                    successCallback() {
                        dispatch(user.actions.getAccount());
                        successCallback();
                    },
                    errorCallback,
                })
            );
        },
        notify: (message, dismiss = 3000) => {
            dispatch(showNotification(message, 'settings', dismiss));
        },
        loadFavorites() {
            dispatch({
                type: FAVORITES_LOAD,
                payload: {},
            });
        },
    })
)
class UserProfileContainer extends Component {
    static propTypes = {
        pageAccountName: PropTypes.string,
        isOwner: PropTypes.bool,
        params: PropTypes.object,
        route: PropTypes.object,
        routeParams: PropTypes.object,
        routes: PropTypes.array,
        router: PropTypes.any,
        content: PropTypes.any, // Routed component
        currentUser: PropTypes.object, // Immutable.Map
        currentAccount: PropTypes.object, // Immutable.Map
    };

    componentDidMount() {
        this.props.loadFavorites();
    }

    render() {
        const { pageAccountName } = this.props;

        return (
            <Fragment>
                <Helmet title={tt('meta.title.profile.default', { name: pageAccountName })} />
                {this._render()}
            </Fragment>
        );
    }

    _render() {
        const {
            currentUser,
            currentAccount,
            fetching,
            isOwner,
            followerCount,
            followingCount,
            uploadImage,
            updateAccount,
            notify,
        } = this.props;

        if (!currentAccount) {
            if (fetching) {
                return (
                    <Main>
                        <Content center>
                            <LoadingIndicator type="circle" size={40} />
                        </Content>
                    </Main>
                );
            } else {
                return (
                    <Main>
                        <Content center>{tt('user_profile.unknown_account')}</Content>
                    </Main>
                );
            }
        }

        if (blockedUsers.includes(currentAccount.get('name'))) {
            return <IllegalContentMessage />;
        }

        if (blockedUsersContent.includes(currentAccount.get('name'))) {
            return <div>{tt('g.blocked_user_content')}</div>;
        }

        const route = last(this.props.routes).path;

        return (
            <Fragment>
                <UserHeader
                    currentAccount={currentAccount}
                    currentUser={currentUser}
                    isOwner={isOwner}
                    uploadImage={uploadImage}
                    updateAccount={updateAccount}
                    notify={notify}
                    isSettingsPage={route === 'settings'}
                />
                <BigUserNavigation
                    accountName={currentAccount.get('name')}
                    isOwner={isOwner}
                    showLayout={!route || route === 'blog' || route === 'favorites'}
                />
                <WrapperMain>
                    <Main>
                        <SmallUserNavigation
                            accountName={currentAccount.get('name')}
                            isOwner={isOwner}
                            showLayout={!route || route === 'blog' || route === 'favorites'}
                        />
                        {route === 'settings' ? null : (
                            <SidebarLeft>
                                {route === 'transfers' ? null : (
                                    <UserCardAbout
                                        account={currentAccount}
                                        followerCount={followerCount}
                                        followingCount={followingCount}
                                    />
                                )}
                                {this.props.sidebarRight}
                            </SidebarLeft>
                        )}
                        <Content center={route === 'settings'}>{this.props.content}</Content>
                    </Main>
                </WrapperMain>
            </Fragment>
        );
    }
}

export default {
    path: '@:accountName',
    component: UserProfileContainer,
    getIndexRoute(nextState, cb) {
        cb(null, {
            components: {
                content: require('./blog/BlogContent').default,
                sidebarRight: require('../../components/userProfile/common/RightPanel').default,
            },
        });
    },
    childRoutes: [
        {
            path: 'comments',
            getComponents(nextState, cb) {
                cb(null, {
                    content: require('./comments/CommentsContent').default,
                    sidebarRight: require('../../components/userProfile/common/RightPanel').default,
                });
            },
        },
        {
            path: 'recent-replies',
            getComponents(nextState, cb) {
                cb(null, {
                    content: require('./replies/RepliesContent').default,
                    sidebarRight: require('../../components/userProfile/common/RightPanel').default,
                });
            },
        },
        {
            path: 'settings',
            getComponents(nextState, cb) {
                cb(null, {
                    content: require('./settings/SettingsContent').default,
                });
            },
        },
        {
            path: 'transfers',
            getComponents(nextState, cb) {
                cb(null, {
                    content: require('./wallet/WalletContent').default,
                    sidebarRight: require('../../components/userProfile/common/RightPanel').default,
                });
            },
        },
        {
            path: 'activity',
            getComponents(nextState, cb) {
                cb(null, {
                    content: require('./activity').default,
                    sidebarRight: require('../../components/userProfile/common/RightPanel').default,
                });
            },
        },
        {
            path: 'favorites',
            getComponents(nextState, cb) {
                cb(null, {
                    content: require('./favorites/FavoritesContent').default,
                    sidebarRight: require('../../components/userProfile/common/RightPanel').default,
                });
            },
        },
        {
            path: 'messages',
            getComponents(nextState, cb) {
                cb(null, {
                    content: require('../../../messenger/containers/Messenger').default,
                });
            },
        },
    ],
};
