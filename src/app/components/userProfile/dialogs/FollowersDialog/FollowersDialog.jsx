import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, Set, OrderedSet } from 'immutable';
import styled from 'styled-components';
import { Link } from 'react-router';

import tt from 'counterpart';
import o2j from 'shared/clash/object2json';

import Icon from 'golos-ui/Icon';
import SplashLoader from 'golos-ui/SplashLoader';
import Avatar from 'src/app/components/common/Avatar';
import Follow from 'src/app/components/common/Follow';

const Dialog = styled.div`
    position: relative;
    min-width: 800px;
    max-width: 100%;
    color: #333;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 19px 3px rgba(0, 0, 0, 0.2);

    @media (max-width: 500px) {
        min-width: unset;
        max-width: unset;
        width: 100%;
    }
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
    min-height: 200px;
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

const emptyMap = Map();
const emptyOrderedSet = OrderedSet();

@connect((state, props) => {
    const { pageAccountName, type } = props;

    const methodPath = type === 'follower' ? 'getFollowersAsync' : 'getFollowingAsync';
    const countPath = type === 'follower' ? 'follower_count' : 'following_count';

    const followCount = state.global.getIn(['follow_count', pageAccountName, countPath], 0);
    const follow = state.global.getIn(['follow', methodPath, pageAccountName], emptyMap);
    const loadingFollow = follow.get('blog_loading', false) || follow.get('ignore_loading', false);
    const namesFollow = follow.get('blog_result', emptyOrderedSet);

    const accounts = state.global.get('accounts');
    const users = namesFollow.map(name => accounts.get(name));

    return {
        loadingFollow,
        followCount,
        users,
    };
})
export default class FollowersDialog extends PureComponent {
    static propTypes = {
        pageAccountName: PropTypes.string,
        type: PropTypes.string,

        onRef: PropTypes.func.isRequired,

        loadingFollow: PropTypes.bool,
        followCount: PropTypes.number,
        users: PropTypes.instanceOf(OrderedSet),
    };

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    render() {
        const { loadingFollow, followCount, users, type } = this.props;

        return (
            <Dialog>
                <IconClose onClick={this.props.onClose} />
                <Header>
                    <Title>
                        {tt(
                            type === 'follower'
                                ? 'user_profile.follower_count'
                                : 'user_profile.following_count',
                            { count: followCount }
                        )}
                    </Title>
                </Header>
                <Content>
                    {loadingFollow && <SplashLoader />}
                    {users.map((user, key) => {
                        let metaData = user ? o2j.ifStringParseJSON(user.get('json_metadata')) : {};
                        if (typeof metaData === 'string')
                            metaData = o2j.ifStringParseJSON(metaData);
                        const profile = metaData && metaData.profile ? metaData.profile : {};

                        return (
                            <UserItem key={key}>
                                <UserLink to={`/@${user.get('name')}`} title={user.get('name')} onClick={this.props.onClose}>
                                    <Avatar avatarUrl={profile.profile_image} />
                                    <Name>{profile.name || user.get('name')}</Name>
                                </UserLink>
                                <Follow following={user.get('name')} />
                            </UserItem>
                        );
                    })}
                </Content>
            </Dialog>
        );
    }
}
