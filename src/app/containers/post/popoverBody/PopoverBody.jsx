import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import { Link } from 'react-router';

import Icon from 'golos-ui/Icon';

import { breakWordStyles } from 'src/app/helpers/styles';

import Userpic from 'src/app/components/common/Userpic';
import { ClosePopoverButton } from 'src/app/components/post/PopoverAdditionalStyles';
import Mute from 'src/app/components/common/Mute';
import Follow from 'src/app/components/common/Follow';
import UserStatus from 'src/app/components/userProfile/common/UserStatus';

const Block = styled.div`
    width: 100%;
    border-bottom: 2px solid #e1e1e1;
    padding: 17px 0 21px;

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
`;

const ButtonsBlock = styled(Block)`
    display: flex;
    justify-content: space-between;
`;

const Wrapper = styled.section`
    min-width: 300px;
    max-width: 100%;
    position: relative;
    padding: 8px 20px 20px;

    & ${Block}:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    @media (max-width: 768px) {
        min-width: 330px;
        background: #ffffff;
        border-radius: 7px;
    }
`;

const AuthorTitle = styled.div`
    display: flex;
    padding-right: 20px;
`;

const AuthorInfoBlock = styled(Link)`
    padding-right: 12px;
    margin-right: auto;
`;

const AuthorName = styled.div`
    color: #393636;
    font-family: 'Open Sans', sans-serif;
    font-size: 24px;
    font-weight: bold;
    line-height: 25px;
`;

const AuthorAccount = styled.div`
    display: inline-block;
    padding: 0 10px;
    margin-left: -10px;
    color: #959595;
    font: 13px Roboto, sans-serif;
    letter-spacing: 0.4px;
    text-decoration: none;
    line-height: 25px;
`;

const About = styled.p`
    color: #959595;
    font: 16px 'Open Sans', sans-serif;
    letter-spacing: -0.26px;
    line-height: 24px;
`;

const Followers = styled.div``;

const AvatarLink = styled(Link)`
    display: flex;
    position: relative;
    border-radius: 50%;

    &::after {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        content: '${props => props.rating}';
        bottom: 0;
        right: 0;
        width: 24px;
        height: 24px;
        border-radius: 100px;
        background-color: #fff;
        font-size: 10px;
        font-weight: bold;
        color: #2879ff;
        transform: translate(30%, 40%);
    }
`;

const PinnedPost = styled.div`
    display: flex;
    margin-top: 20px;
`;

const PinnedIcon = styled(Icon)`
    width: 20px;
    flex-shrink: 0;
`;

const PostsTitle = styled.div`
    color: #393636;
    font: 14px 'Open Sans', sans-serif;
    font-weight: 600;
    line-height: 16px;
    flex-shrink: 1;
    text-transform: uppercase;
`;

const PostTitle = styled(Link)`
    margin-left: 12px;
    color: #333333;
    font: 16px Roboto;
    font-weight: 500;
    line-height: 24px;
    text-decoration: none;
    ${breakWordStyles};

    &:visited,
    &:hover,
    &:active {
        color: #333333;
    }
`;

const FollowButton = styled(props => <Follow {...props} />)`
    min-width: 150px;
    min-height: 30px;
`;

const MuteButton = styled(Mute)`
    min-width: 130px;
    min-height: 30px;
    margin-left: 10px;
`;

export class PopoverBody extends Component {
    static propTypes = {
        closePopover: PropTypes.func,
    };

    componentDidMount() {
        this.fetchFollowData();
        if (this.props.pinnedPostsUrls) {
            this.props.getPostContent(this.props.pinnedPostsUrls);
        }
    }

    fetchFollowData() {
        const { account, followersCount, loadUserFollowData } = this.props;
        if (!followersCount) {
            loadUserFollowData(account);
        }
    }

    render() {
        const {
            account,
            name,
            about,
            followersCount,
            pinnedPosts,
            showFollowBlock,
            reputation,
            closePopover,
            className,
        } = this.props;
        const linkToAccount = `/@${account}`;

        return (
            <Wrapper className={className}>
                <ClosePopoverButton
                    aria-label={tt('aria_label.close_button')}
                    onClick={closePopover}
                >
                    <Icon name="cross" width={16} height={16} />
                </ClosePopoverButton>
                <Block>
                    <AuthorTitle>
                        <AuthorInfoBlock to={linkToAccount}>
                            <AuthorName>{name}</AuthorName>
                            <AuthorAccount aria-label={tt('aria_label.username')}>
                                @{account}
                            </AuthorAccount>
                        </AuthorInfoBlock>
                        <AvatarLink
                            to={linkToAccount}
                            aria-label={tt('aria_label.avatar')}
                            rating={reputation}
                        >
                            <Userpic size={50} account={account} />
                        </AvatarLink>
                    </AuthorTitle>
                    <UserStatus currentAccount={account} popover />
                    <About>{about}</About>
                    <Followers>
                        {tt('user_profile.follower_count', { count: followersCount })}
                    </Followers>
                </Block>
                {pinnedPosts.length > 0 && (
                    <Block>
                        <PostsTitle>{tt('g.authors_posts')}</PostsTitle>
                        {pinnedPosts.map(post => (
                            <PinnedPost key={post.url}>
                                <PinnedIcon name="pin" />
                                <PostTitle to={post.url}>{post.title}</PostTitle>
                            </PinnedPost>
                        ))}
                    </Block>
                )}
                {showFollowBlock && (
                    <ButtonsBlock>
                        <FollowButton
                            following={account}
                            collapseOnMobile={false}
                            onClick={this.closePopover}
                        />
                        <MuteButton role="button" muting={account} onClick={this.closePopover} />
                    </ButtonsBlock>
                )}
            </Wrapper>
        );
    }
}
