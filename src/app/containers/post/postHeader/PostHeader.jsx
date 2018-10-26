import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';

import Userpic from 'app/components/elements/Userpic';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import PopoverBody from 'src/app/containers/post/popoverBody/index';
import {
    PopoverBackgroundShade,
    PopoverStyled,
} from 'src/app/components/post/PopoverAdditionalStyles';
import PostActions from 'src/app/components/post/PostActions';

const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 25px;
    border-bottom: 2px solid #e1e1e1;

    @media (max-width: 576px) {
        justify-content: space-between;
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
`;

const UserInfoWrapper = styled(Link)`
    display: flex;
    align-items: center;
    cursor: pointer;
    outline: none;
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
    align-items: center;
    margin-left: auto;
    margin-right: -7px;
`;

const PostActionsStyled = styled(PostActions)`
    padding: 5px;
    margin: 0 3px;
`;

const AvatarBox = styled.div`
    position: absolute;
    top: 50px;
    width: 50px;
`;

export class PostHeader extends Component {
    static propTypes = {
        url: PropTypes.string,
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
        this.props.updateFollow(this.props.username, this.props.author, null);
    };

    render() {
        const {
            isMy,
            created,
            isPinned,
            togglePin,
            isOwner,
            isFavorite,
            toggleFavorite,
            author,
            isFollow,
            className,
            postUrl,
        } = this.props;

        const { showPopover } = this.state;

        return (
            <Wrapper className={className}>
                <UserInfoWrapper to={`/@${author}`} onClick={this.onUserInfoClick}>
                    <Avatar>
                        <PopoverBackgroundShade show={showPopover} />
                        <UserpicStyled account={author} size={50} />
                    </Avatar>
                    <InfoBlock>
                        <AuthorName>{author}</AuthorName>
                        <TimeAgoWrapper date={created} />
                    </InfoBlock>
                </UserInfoWrapper>
                {!isMy &&
                    (isFollow ? (
                        <FollowRound light onClick={this.unfollow} data-tooltip={tt('g.unfollow')}>
                            <FollowedIcon name="tick" width={18} height={14} />
                        </FollowRound>
                    ) : (
                        <FollowRound onClick={this.follow} data-tooltip={tt('g.follow')}>
                            <CustomIcon name="plus" width={12} height={12} />
                        </FollowRound>
                    ))}
                <PostActionsWrapper>
                    <PostActionsStyled
                        postUrl={postUrl}
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
                            <PopoverBody close={this.closePopover} author={author} />
                        </PopoverStyled>
                    </AvatarBox>
                ) : null}
            </Wrapper>
        );
    }
}
