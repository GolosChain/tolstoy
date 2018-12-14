import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';
import { TagLink } from 'golos-ui/Tag';
import Userpic from 'app/components/elements/Userpic';

import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import PopoverBody from 'src/app/containers/post/popoverBody';
import {
    PopoverBackgroundShade,
    PopoverStyled,
} from 'src/app/components/post/PopoverAdditionalStyles';
import PostActions from 'src/app/components/post/PostActions';

const Wrapper = styled.div`
    position: relative;
    padding-bottom: 25px;

    display: grid;
    grid-template-rows: auto;
    grid-template-columns: auto auto 1fr auto auto auto;
    grid-template-areas: 'author follow . promoted category actions';

    @media (max-width: 768px) {
        grid-template-rows: auto auto;
        grid-template-columns: auto auto auto 1fr auto auto;
        grid-template-areas:
            'author author follow . . actions'
            'category . . . promoted promoted';
        grid-row-gap: 25px;
    }

    @media (max-width: 576px) {
        padding-bottom: 15px;
    }
`;

const Avatar = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const InfoBlock = styled.div`
    margin: 0 10px;
    letter-spacing: 0.4px;
    line-height: 18px;

    span {
        display: block;
        color: #959595;
        font: 13px Roboto, sans-serif;
    }

    @media (max-width: 576px) {
        font-size: 12px;
    }
`;

const AuthorName = styled.div`
    display: inline-block;
    padding: 5px 10px;
    margin: -5px 0 0 -10px;
    font-size: 15px;
    font-weight: 500;
    white-space: nowrap;
    color: #333;
    text-decoration: none;

    @media (max-width: 576px) {
        font-size: 14px;
    }
`;

const CustomIcon = styled(Icon)`
    min-width: 12px;
    min-height: 12px;
    flex-shrink: 0;
`;

const FollowedIcon = styled(CustomIcon)`
    margin: 1px 0 0 1px;
`;

const FollowRound = styled(Button)`
    width: 34px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 30px;
    border-radius: 50%;
    cursor: pointer;

    grid-area: follow;
    align-self: center;
`;

const UserInfoWrapper = styled(Link)`
    display: flex;
    align-items: center;
    cursor: pointer;
    outline: none;

    grid-area: author;
`;

const UserpicStyled = styled(Userpic)`
    display: block;

    @media (max-width: 576px) {
        width: 38px !important;
        height: 38px !important;
    }
`;

const PostActionsWrapper = styled.div`
    display: flex;

    grid-area: actions;
    align-self: center;
`;

const PostActionsStyled = styled(PostActions)`
    height: 34px;
    padding: 5px;
    margin: 0 3px;
`;

const AvatarBox = styled.div`
    position: absolute;
    top: 50px;
    width: 50px;
`;

const PromotedMark = styled.div`
    position: relative;
    display: flex;
    grid-area: promoted;
    align-self: center;
    margin: 0 18px;

    &::after {
        content: '';
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -40%);
        z-index: 1;
        width: 14px;
        height: 17px;
        box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.4);
    }

    @media (max-width: 768px) {
        justify-self: end;
        max-width: 34px;
        margin-right: 0;
    }
`;

const PromotedIcon = styled(Icon)`
    position: relative;
    z-index: 2;
    min-width: 34px;
    min-height: 37px;
`;

const Category = styled(TagLink)`
    grid-area: category;
    align-self: center;
`;

export class PostHeader extends Component {
    static propTypes = {
        postUrl: PropTypes.string,
        togglePin: PropTypes.func.isRequired,
        toggleFavorite: PropTypes.func.isRequired,
    };

    closePopoverTs = 0;

    state = {
        showPopover: false,
    };

    onUserInfoClick = e => {
        e.preventDefault();

        if (Date.now() > this.closePopoverTs + 200) {
            this.setState({
                showPopover: true,
            });
        }
    };

    closePopover = () => {
        this.closePopoverTs = Date.now();

        this.setState({
            showPopover: false,
        });
    };

    follow = () => {
        this.props.updateFollow(this.props.username, this.props.author, 'blog');
    };

    unfollow = () => {
        const { author, confirmUnfollowDialog } = this.props;
        confirmUnfollowDialog(author);
    };

    render() {
        const {
            forwardRef,
            created,
            category,
            isPinned,
            togglePin,
            isOwner,
            isFavorite,
            toggleFavorite,
            author,
            isFollow,
            postUrl,
            isPromoted,
            className,
        } = this.props;
        const { showPopover } = this.state;
        const contentLink = postUrl.replace(/\/[^\/]+\/@([^\/]+\/[^\/]+)/, '$1');

        return (
            <Wrapper innerRef={forwardRef} className={className}>
                <UserInfoWrapper to={`/@${author}`} onClick={this.onUserInfoClick}>
                    <Avatar aria-label={tt('aria_label.avatar')}>
                        <PopoverBackgroundShade show={showPopover} />
                        <UserpicStyled account={author} size={50} />
                    </Avatar>
                    <InfoBlock>
                        <AuthorName aria-label={tt('aria_label.username')}>{author}</AuthorName>
                        <TimeAgoWrapper date={created} />
                    </InfoBlock>
                </UserInfoWrapper>
                {!isOwner &&
                    (isFollow ? (
                        <FollowRound
                            light
                            onClick={this.unfollow}
                            data-tooltip={tt('g.unfollow')}
                            aria-label={tt('g.unfollow')}
                        >
                            <FollowedIcon name="tick" width={18} height={14} />
                        </FollowRound>
                    ) : (
                        <FollowRound
                            onClick={this.follow}
                            data-tooltip={tt('g.follow')}
                            aria-label={tt('g.follow')}
                        >
                            <CustomIcon name="plus" width={12} height={12} />
                        </FollowRound>
                    ))}
                {isPromoted && (
                    <PromotedMark>
                        <PromotedIcon name="best" width="34" height="37" />
                    </PromotedMark>
                )}
                <Category
                    to={'/trending?tags=' + category.tag}
                    category={1}
                    aria-label={tt('aria_label.category', { category: category.tag })}
                >
                    {category.tag}
                </Category>
                <PostActionsWrapper>
                    <PostActionsStyled
                        fullUrl={postUrl}
                        isFavorite={isFavorite}
                        isPinned={isPinned}
                        isOwner={isOwner}
                        toggleFavorite={toggleFavorite}
                        togglePin={togglePin}
                    />
                </PostActionsWrapper>
                {showPopover ? (
                    <AvatarBox>
                        <PopoverStyled onClose={this.closePopover} show>
                            <PopoverBody close={this.closePopover} permLink={contentLink} />
                        </PopoverStyled>
                    </AvatarBox>
                ) : null}
            </Wrapper>
        );
    }
}
