import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Icon from 'golos-ui/Icon';
import Userpic from 'app/components/elements/Userpic';
import tt from 'counterpart';
import { Link } from 'react-router';
import Button from 'golos-ui/Button';
import ToggleFollowButton from '../common/ToggleFollowButton';

const Block = styled.div`
    width: 100%;
    border-bottom: 2px solid #e1e1e1;
    padding-bottom: 21px;
    padding-top: 17px;

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
`;

const ButtonsBlock = Block.extend`
    display: flex;
    justify-content: space-between;
`;

const Wrapper = styled.section`
    width: 330px;
    max-width: 100%;
    position: relative;
    padding: 8px 20px 20px;

    & ${Block}:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
`;

const CloseButton = styled.div`
    width: 24px;
    height: 24px;
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    & svg {
        color: #e1e1e1;
    }

    &:hover svg {
        color: #b9b9b9;
    }
`;

const AuthorTitle = styled.div`
    display: flex;
    padding-right: 20px;
`;

const AuthorInfoBlock = styled.div`
    margin-right: auto;
`;

const AuthorName = styled(Link)`
    display: block;
    font-size: 15px;
    font-weight: 500;
    color: #333;
    text-decoration: none;
`;

const AuthorAccount = styled.div`
    color: #959595;
    font: 13px Roboto, sans-serif;
    letter-spacing: 0.4px;
`;

const About = styled.p`
    color: #959595;
    font: 16px 'Open Sans', sans-serif;
    letter-spacing: -0.26px;
    line-height: 24px;
`;

const Followers = styled.div``;

const PinnedPost = styled.div`
    display: flex;
    margin-top: 20px;
`;

const PostsTitle = styled.div`
    color: #393636;
    font: 14px 'Open Sans', sans-serif;
    font-weight: 600;
    line-height: 16px;
    flex-shrink: 1;
`;
const PostTitle = styled(Link)`
    margin-left: 12px;
    color: #333333;
    font: 16px Roboto;
    font-weight: 500;
    line-height: 24px;
    text-decoration: none;

    &:visited,
    &:hover,
    &:active {
        color: #333333;
    }
`;

const CustomButton = styled(Button)`
    height: 30px;
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;
`;

const BlockButton = styled.div`
    display: flex;
    align-items: center;
    padding: 0 10px;
    color: #959595;
    font: 12px 'Open Sans', sans-serif;
    font-weight: bold;
    line-height: 23px;
    text-align: right;
    text-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5), 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
        color: #7a7a7a;
    }
`;

class Popover extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        author: PropTypes.shape({
            name: PropTypes.string,
            about: PropTypes.string,
            account: PropTypes.string.isRequired,
            isFollow: PropTypes.bool.isRequired,
            followerCount: PropTypes.number.isRequired,
            pinnedPosts: PropTypes.array.isRequired,
            follow: PropTypes.func.isRequired,
            unfollow: PropTypes.func.isRequired,
        }).isRequired,
    };

    render() {
        const { author, className } = this.props;
        const {
            account,
            name,
            about,
            followerCount,
            pinnedPosts,
            isFollow,
            follow,
            unfollow,
        } = author;
        return (
            <Wrapper className={className}>
                <Link />
                <CloseButton onClick={this._closePopover}>
                    <Icon name="cross" width={16} height={16} />
                </CloseButton>
                <Block>
                    <AuthorTitle>
                        <AuthorInfoBlock>
                            <AuthorName to={`/@${account}`}>{name}</AuthorName>
                            <AuthorAccount>@{account}</AuthorAccount>
                        </AuthorInfoBlock>
                        <Userpic size={50} account={account} />
                    </AuthorTitle>
                    <About>{about}</About>
                    <Followers>
                        {tt('user_profile.follower_count', { count: followerCount })}
                    </Followers>
                </Block>
                {pinnedPosts.length > 0 && (
                    <Block>
                        <PostsTitle>ПОСТЫ АВТОРА</PostsTitle>
                        {pinnedPosts.map(post => (
                            <PinnedPost key={post.url}>
                                <Icon name="pin" size="20px" />
                                <PostTitle to={post.url}>{post.title}</PostTitle>
                            </PinnedPost>
                        ))}
                    </Block>
                )}
                <ButtonsBlock>
                    <ToggleFollowButton
                        isFollow={isFollow}
                        buttonWidth={150}
                        followFunc={follow}
                        unfollowFunc={unfollow}
                    />
                    <BlockButton>заблокировать</BlockButton>
                </ButtonsBlock>
            </Wrapper>
        );
    }

    _closePopover = e => {
        e.stopPropagation();
        this.props.close();
    };
}

export default Popover;
