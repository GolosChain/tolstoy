import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Userpic from '../../../../app/components/elements/Userpic';
import TimeAgoWrapper from '../../../../app/components/elements/TimeAgoWrapper';
import is from 'styled-is';
import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 25px;
    border-bottom: 2px solid #e1e1e1;
`;

const Avatar = styled.div`
    cursor: pointer;
`;

const InfoBlock = styled.div`
    margin: 0 10px;
    color: #959595;
    font: 13px Roboto, sans-serif;
    letter-spacing: 0.4px;
    line-height: 18px;
`;

const AuthorName = styled.div`
    font-size: 15px;
    font-weight: 500;
    color: #333;
`;

const ChangeFollow = styled.div`
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background-color: blue;

    ${is('isFollowed')`
        background-color: green;
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

    ${is('enabled')`
        cursor: pointer;
        transition: transform 0.15s;

        &:hover {
            transform: scale(1.15);
        }
    `};
`;

class PostHeader extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
        userName: PropTypes.string.isRequired,
        isFavorite: PropTypes.bool,
    };

    static defaultProps = {
        isFavorite: true,
    };

    render() {
        const { userName, post, isFavorite, className } = this.props;
        return (
            <Wrapper className={className}>
                <Avatar>
                    <Userpic account={post.get('author')} size={50} />
                </Avatar>
                <InfoBlock>
                    <AuthorName>{post.get('author')}</AuthorName>
                    <TimeAgoWrapper date={post.get('created')} />
                </InfoBlock>
                {userName !== post.get('author') && <ChangeFollow isFollowed={true} />}
                <IconWrapper
                    data-tooltip={isFavorite ? 'Убрать из избранного' : 'В избранное'}
                    enabled
                >
                    <Icon name={isFavorite ? 'star_filled' : 'star'} width={20} height={20} />
                </IconWrapper>
            </Wrapper>
        );
    }
}

export default PostHeader;
