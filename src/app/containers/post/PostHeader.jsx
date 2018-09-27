import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Icon from 'golos-ui/Icon';

import Userpic from 'app/components/elements/Userpic';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import PopoverBody from 'src/app/components/post/PopoverBody';
import { toggleFavoriteAction } from 'src/app/redux/actions/favorites';
import { updateFollow } from 'src/app/redux/actions/follow';
import {
    PopoverBackgroundShade,
    PopoverStyled,
} from 'src/app/components/post/PopoverAdditionalStyles';
import { postHeaderSelector } from 'src/app/redux/selectors/post/postHeader';
import Button from 'src/app/components/golos-ui/Button';

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

@connect(
    postHeaderSelector,
    {
        toggleFavorite: (link, isAdd) => {
            toggleFavoriteAction({ link, isAdd });
        },
        updateFollow,
    }
)
export default class PostHeader extends Component {
    state = {
        isPopoverOpen: false,
    };

    _onRef = ref => {
        this.tooltip = ref;
    };

    _openPopover = () => {
        this.tooltip.open();
    };

    _closePopover = () => {
        this.tooltip.close();
    };

    _toggleFavorite = () => {
        const { author, permLink, isFavorite } = this.props;
        this.props.toggleFavorite(author + '/' + permLink, !isFavorite);
    };

    _follow = () => {
        this.props.updateFollow(this.props.username, this.props.author, 'blog');
    };

    _unfollow = () => {
        this.props.updateFollow(this.props.username, this.props.author, null);
    };

    togglePopoverOpen = () => {
        this.setState({ isPopoverOpen: !this.state.isPopoverOpen });
    };

    render() {
        const { isPopoverOpen } = this.state;
        const { isMy, created, isFavorite, author, isFollow, className } = this.props;

        return (
            <Wrapper className={className}>
                <UserInfoWrapper>
                    <Avatar>
                        <PopoverBackgroundShade show={isPopoverOpen} />
                        <UserpicStyled account={author} size={50} onClick={this._openPopover} />
                        <PopoverStyled innerRef={this._onRef} onToggleOpen={this.togglePopoverOpen}>
                            <PopoverBody close={this._closePopover} author={author} />
                        </PopoverStyled>
                    </Avatar>
                    <InfoBlock>
                        <AuthorName to={`/@${author}`}>{author}</AuthorName>
                        <TimeAgoWrapper date={created} />
                    </InfoBlock>
                </UserInfoWrapper>
                {!isMy &&
                    (isFollow ? (
                        <FollowRound light onClick={this._unfollow} data-tooltip={tt('g.unfollow')}>
                            <Icon name="cross" width={12} height={12} />
                        </FollowRound>
                    ) : (
                        <FollowRound onClick={this._follow} data-tooltip={tt('g.follow')}>
                            <Icon name="check" width={14} height={10} />
                        </FollowRound>
                    ))}
                <IconWrapper
                    data-tooltip={
                        isFavorite ? tt('g.remove_from_favorites') : tt('g.add_to_favorites')
                    }
                    onClick={this._toggleFavorite}
                >
                    <Icon name={isFavorite ? 'star_filled' : 'star'} width={20} height={20} />
                </IconWrapper>
            </Wrapper>
        );
    }
}
