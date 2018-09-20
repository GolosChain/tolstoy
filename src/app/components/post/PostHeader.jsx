import React, { Component } from 'react';
import styled from 'styled-components';
import Userpic from '../../../../app/components/elements/Userpic';
import TimeAgoWrapper from '../../../../app/components/elements/TimeAgoWrapper';
import tt from 'counterpart';
import { Link } from 'react-router';
import PopoverBody from './PopoverBody';
import Icon from '../golos-ui/Icon';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    authorSelector,
    currentPostSelector,
    currentUsernameSelector,
} from '../../redux/selectors/post/post';
import { toggleFavoriteAction } from '../../redux/actions/favorites';
import { updateFollow } from '../../redux/actions/follow';
import Popover from '../golos-ui/Popover/Popover';
import DialogManager from '../../../../app/components/elements/common/DialogManager/index';

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
    color: #959595;
    font: 13px Roboto, sans-serif;
    letter-spacing: 0.4px;
    line-height: 18px;

    span {
        display: block;
        margin-top: -5px;
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
`;

const Follow = styled.div`
    width: 34px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
`;

const Followed = Follow.extend`
    color: #393636;
    background-color: transparent;
    border: 1px solid #e1e1e1;

    &:hover {
        color: #2879ff;
        background-color: transparent;
        border: 1px solid rgba(40, 121, 255, 0.3);
    }
`;

const NoFollowed = Follow.extend`
    color: #ffffff;
    background-color: #2879ff;

    &:hover {
        background-color: #1d69e8;
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

const PopoverStyled = styled(Popover)`
    @media (max-width: 768px) {
        display: none;
    }
`;

class PostHeader extends Component {
    static propTypes = {
        isPadScreen: PropTypes.bool.isRequired,
    };

    render() {
        const { isMy, created, isFavorite, author, isFollow, className, isPadScreen } = this.props;
        return (
            <Wrapper className={className}>
                <UserInfoWrapper>
                    <Avatar>
                        <Userpic account={author} size={isPadScreen ? 38 : 50} onClick={this._openPopover} />
                        <PopoverStyled innerRef={this._onRef}>
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
                        <Followed onClick={this._unfollow} data-tooltip={tt('g.unfollow')}>
                            <Icon name="cross" width={12} height={12} />
                        </Followed>
                    ) : (
                        <NoFollowed onClick={this._follow} data-tooltip={tt('g.follow')}>
                            <Icon name="check" width={14} height={10} />
                        </NoFollowed>
                    ))}
                <IconWrapper
                    data-tooltip={isFavorite ? 'Убрать из избранного' : 'В избранное'}
                    onClick={this._toggleFavorite}
                >
                    <Icon name={isFavorite ? 'star_filled' : 'star'} width={20} height={20} />
                </IconWrapper>
            </Wrapper>
        );
    }

    _onRef = ref => {
        this.tooltip = ref;
    };

    _openPopover = () => {
        if (this.props.isPadScreen) {
            this._openMobileDialog();
        } else {
            this.tooltip.open();
        }
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

    _openMobileDialog = () => {
        DialogManager.showDialog({
            component: PopoverBody,
            props: {
                author: this.props.author,
            },
        });
    };
}

const mapStateToProps = (state, props) => {
    const post = currentPostSelector(state, props);
    const author = authorSelector(state, props);
    const username = currentUsernameSelector(state);
    return {
        username,
        isMy: username === author.account,
        created: post.created,
        isFavorite: post.isFavorite,
        author: author.account,
        isFollow: author.isFollow,
        permLink: post.permLink,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleFavorite: (link, isAdd) => {
            dispatch(toggleFavoriteAction({ link, isAdd }));
        },
        updateFollow: (follower, following, action) => {
            dispatch(updateFollow(follower, following, action));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostHeader);
