import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';
import { Link } from 'react-router';

import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';

import Userpic from 'app/components/elements/Userpic';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import PopoverBody from 'src/app/containers/post/popoverBody/index';
import {
    PopoverBackgroundShade,
    PopoverStyled,
} from 'src/app/components/post/PopoverAdditionalStyles';

const Wrapper = styled.div`
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
    cursor: pointer;
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

const AuthorName = styled(Link)`
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

const FollowRound = styled(Button)`
    width: 34px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;

    svg {
        min-width: 12px;
        min-height: 12px;
        margin: 0;
    }
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    width: 32px;
    height: 32px;
    color: ${({ color }) => color || '#393636'};

    cursor: pointer;
    transition: transform 0.15s;

    &:hover {
        transform: scale(1.15);
    }

    @media (max-width: 576px) {
        margin-left: 0;
    }
`;

const UserInfoWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const UserpicStyled = styled(Userpic)`
    @media (max-width: 576px) {
        width: 38px !important;
        height: 38px !important;
    }
`;

export class PostHeader extends Component {
    state = {
        showPopover: false,
    };

    openPopover = () => {
        this.setState({
            showPopover: true,
        });
    };

    closePopover = () => {
        this.setState({
            showPopover: false,
        });
    };

    toggleFavorite = () => {
        const { author, permLink, isFavorite } = this.props;
        this.props.toggleFavorite(author + '/' + permLink, !isFavorite);
    };

    follow = () => {
        this.props.updateFollow(this.props.username, this.props.author, 'blog');
    };

    unfollow = () => {
        this.props.updateFollow(this.props.username, this.props.author, null);
    };

    render() {
        const { showPopover } = this.state;
        const { isMy, created, isFavorite, author, isFollow, className } = this.props;

        return (
            <Wrapper className={className}>
                <UserInfoWrapper>
                    <Avatar>
                        <PopoverBackgroundShade show={showPopover} />
                        <UserpicStyled account={author} size={50} onClick={this.openPopover} />
                        <PopoverStyled onClose={this.closePopover} show={showPopover}>
                            <PopoverBody close={this.closePopover} author={author} />
                        </PopoverStyled>
                    </Avatar>
                    <InfoBlock>
                        <AuthorName to={`/@${author}`}>{author}</AuthorName>
                        <TimeAgoWrapper date={created} />
                    </InfoBlock>
                </UserInfoWrapper>
                {!isMy &&
                    (isFollow ? (
                        <FollowRound light onClick={this.unfollow} data-tooltip={tt('g.unfollow')}>
                            <Icon name="cross" width={12} height={12} />
                        </FollowRound>
                    ) : (
                        <FollowRound onClick={this.follow} data-tooltip={tt('g.follow')}>
                            <Icon name="check" width={14} height={10} />
                        </FollowRound>
                    ))}
                <IconWrapper
                    data-tooltip={
                        isFavorite ? tt('g.remove_from_favorites') : tt('g.add_to_favorites')
                    }
                    onClick={this.toggleFavorite}
                >
                    <Icon name={isFavorite ? 'star_filled' : 'star'} width={20} height={20} />
                </IconWrapper>
            </Wrapper>
        );
    }
}
