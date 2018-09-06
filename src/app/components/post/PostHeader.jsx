import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Userpic from '../../../../app/components/elements/Userpic';
import TimeAgoWrapper from '../../../../app/components/elements/TimeAgoWrapper';
import is from 'styled-is';
import Icon from 'golos-ui/Icon';
import tt from 'counterpart';
import { Link } from 'react-router';
import Tooltip from './Tooltip';
import Popover from './Popover';

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
    background-color: #2879ff;
    cursor: pointer;

    ${is('isFollowed')`
        background-color: transparent;
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
        }).isRequired,
        username: PropTypes.string,
        author: PropTypes.shape({
            isFollow: PropTypes.bool,
        }).isRequired,
        onFavoriteClick: PropTypes.func.isRequired,
        changeFollow: PropTypes.func.isRequired,
    };

    static defaultProps = {
        author: {
            isFollow: false,
        },
    };

    render() {
        const { username, post, author, onFavoriteClick, changeFollow, className } = this.props;
        const { created, isFavorite, author: authorName } = post;
        return (
            <Wrapper className={className}>
                <Avatar onClick={this._openPopover}>
                    <Userpic account={authorName} size={50} />
                    <Tooltip ref={ref => (this.tooltip = ref)}>
                        <Popover close={this._closePopover} />
                    </Tooltip>
                </Avatar>
                <InfoBlock>
                    <AuthorName to={`/@${authorName}`}>{authorName}</AuthorName>
                    <TimeAgoWrapper date={created} />
                </InfoBlock>
                {username !== authorName && (
                    <ChangeFollow
                        onClick={changeFollow}
                        isFollowed={author.isFollow}
                        data-tooltip={author.isFollow ? tt('g.unfollow') : tt('g.follow')}
                    >
                        <Icon
                            name="check"
                            width={14}
                            height={10}
                            color={author.isFollow ? '#959595' : 'white'}
                        />
                    </ChangeFollow>
                )}
                <IconWrapper
                    data-tooltip={isFavorite ? 'Убрать из избранного' : 'В избранное'}
                    onClick={onFavoriteClick}
                >
                    <Icon name={isFavorite ? 'star_filled' : 'star'} width={20} height={20} />
                </IconWrapper>
            </Wrapper>
        );
    }

    _openPopover = e => {
        e.stopPropagation();
        this.tooltip.open();
    };

    _closePopover = () => {
        this.tooltip.close();
    };
}

export default PostHeader;
