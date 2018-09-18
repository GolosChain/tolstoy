import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Icon from '../golos-ui/Icon';
import Userpic from 'app/components/elements/Userpic';
import tt from 'counterpart';
import { Link } from 'react-router';
import FollowButton from '../common/FollowButton';
import MuteButton from '../common/MuteButton';
import { authorSelector } from '../../redux/selectors/post/post';
import { toggleFavoriteAction } from '../../redux/actions/favorites';

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

const AuthorName = styled.div`
    color: #393636;
    font-family: 'Open Sans', sans-serif;
    font-size: 24px;
    font-weight: bold;
    line-height: 25px;
`;

const AuthorAccount = styled(Link)`
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

const Follow = styled(FollowButton)`
    min-width: 150px;
    min-height: 30px;
`;

const Mute = styled(MuteButton)`
    min-width: 150px;
    min-height: 30px;
    margin-left: 10px;
`;

class Popover extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
    };

    render() {
        const { account, name, about, followerCount, pinnedPosts, className } = this.props;

        return (
            <Wrapper className={className}>
                <Link />
                <CloseButton onClick={this._closePopover}>
                    <Icon name="cross" width={16} height={16} />
                </CloseButton>
                <Block>
                    <AuthorTitle>
                        <AuthorInfoBlock>
                            <AuthorName>{name}</AuthorName>
                            <AuthorAccount to={`/@${account}`}>@{account}</AuthorAccount>
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
                    <Follow following={account} onClick={this._closePopover} />
                    <Mute muting={account} onClick={this._closePopover} />
                </ButtonsBlock>
            </Wrapper>
        );
    }

    _closePopover = () => {
        this.props.close();
    };
}

const mapStateToProps = (state, props) => {
    const author = authorSelector(state, props);
    return {
        account: author.account,
        name: author.name,
        about: author.about,
        followerCount: author.followerCount,
        pinnedPosts: author.pinnedPosts,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleFavorite: (link, isAdd) => {
            dispatch(toggleFavoriteAction({ link, isAdd }));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Popover);
