import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Userpic from '../../../../app/components/elements/Userpic';
import TimeAgoWrapper from '../../../../app/components/elements/TimeAgoWrapper';
import is from 'styled-is';
import tt from 'counterpart';
import { Link } from 'react-router';
import Tooltip from './Tooltip';
import Popover from './Popover';
import Icon from '../golos-ui/Icon';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 25px;
    border-bottom: 2px solid #e1e1e1;
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
`;

const AuthorName = styled(Link)`
    display: block;
    font-size: 15px;
    font-weight: 500;
    color: #333;
    text-decoration: none;
`;

const ChangeFollow = styled.div`
    width: 34px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: #ffffff;
    background-color: #2879ff;
    cursor: pointer;

    &:hover {
        background-color: #1d69e8;
    }

    ${is('isFollow')`
        background-color: transparent;
        border: 1px solid #e1e1e1;
        color: #393636;
        
        &:hover {
            color: #2879ff;
            background-color: transparent;
            border: 1px solid rgba(40, 121, 255, .3);
        }
    `};
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
`;

class PostHeader extends Component {
    static propTypes = {
        post: PropTypes.shape({
            author: PropTypes.string.isRequired,
            created: PropTypes.string.isRequired,
            isFavorite: PropTypes.bool.isRequired,
            toggleFavorite: PropTypes.func.isRequired,
        }).isRequired,
        username: PropTypes.string,
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

    static defaultProps = {
        author: {
            isFollow: false,
        },
    };

    render() {
        const { username, post, author, className } = this.props;
        const { created, isFavorite, author: authorName } = post;
        const { isFollow, follow, unfollow } = author;
        return (
            <Wrapper className={className}>
                <Avatar>
                    <Userpic account={authorName} size={50} onClick={this._openPopover} />
                    <Tooltip ref={ref => (this.tooltip = ref)}>
                        <Popover close={this._closePopover} author={author} />
                    </Tooltip>
                </Avatar>
                <InfoBlock>
                    <AuthorName to={`/@${authorName}`}>{authorName}</AuthorName>
                    <TimeAgoWrapper date={created} />
                </InfoBlock>
                {username !== authorName && (
                    <ChangeFollow
                        onClick={isFollow ? unfollow : follow}
                        isFollow={isFollow}
                        data-tooltip={isFollow ? tt('g.unfollow') : tt('g.follow')}
                    >
                        {isFollow ? (
                            <Icon name="cross" width={12} height={12} />
                        ) : (
                            <Icon name="check" width={14} height={10} />
                        )}
                    </ChangeFollow>
                )}
                <IconWrapper
                    data-tooltip={isFavorite ? 'Убрать из избранного' : 'В избранное'}
                    onClick={post.toggleFavorite}
                >
                    <Icon name={isFavorite ? 'star_filled' : 'star'} width={20} height={20} />
                </IconWrapper>
            </Wrapper>
        );
    }

    _openPopover = () => {
        this.tooltip.open();
    };

    _closePopover = () => {
        this.tooltip.close();
    };
}

export default PostHeader;
