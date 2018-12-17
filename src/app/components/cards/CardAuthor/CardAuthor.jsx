import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import Userpic from 'src/app/components/common/Userpic';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';

const Wrapper = styled.div`
    display: flex;
    align-items: center;

    margin-right: 18px;
`;

const Avatar = styled.span`
    position: relative;
    display: flex;
    margin-right: 10px;
    border-radius: 50%;
`;

const AvatarLink = Avatar.withComponent(Link);

const PostDesc = styled.div`
    font-family: ${a => a.theme.fontFamily};
`;

const AuthorLine = styled.div`
    margin: 3px 0;
    line-height: 1.1;
`;

const AuthorName = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #333;
    text-decoration: none;
`;

const AuthorNameLink = AuthorName.withComponent(Link);

const PostDate = styled(Link)`
    display: block;
    font-size: 13px;
    letter-spacing: 0.4px;
    line-height: 1.5;
    white-space: nowrap;
    color: #959595;
    cursor: pointer;

    &:hover,
    &:focus {
        color: #8b8989;
    }
`;

const RepostIconWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    bottom: -6px;
    left: -6px;
    width: 20px;
    height: 20px;

    border-radius: 50%;
    background-color: #ffffff;
`;

const RepostIcon = styled(Icon)`
    flex-shrink: 0;
    color: #2879ff;
`;

const CardAuthor = ({ contentLink, author, isRepost, created, className, noLinks }) => {
    let AvatarComp = AvatarLink;
    let AuthorNameComp = AuthorNameLink;

    if (noLinks) {
        AvatarComp = Avatar;
        AuthorNameComp = AuthorName;
    }

    return (
        <Wrapper className={className}>
            <AvatarComp to={`/@${author}`} aria-label={tt('aria_label.avatar')}>
                <Userpic account={author} size={37} />
                {isRepost ? (
                    <RepostIconWrapper>
                        <RepostIcon name="repost" width={14} height={12} />
                    </RepostIconWrapper>
                ) : null}
            </AvatarComp>
            <PostDesc>
                <AuthorLine>
                    <AuthorNameComp to={`/@${author}`}>{author}</AuthorNameComp>
                </AuthorLine>
                <PostDate to={contentLink}>
                    <TimeAgoWrapper date={created} />
                </PostDate>
            </PostDesc>
        </Wrapper>
    );
};

CardAuthor.propTypes = {
    author: PropTypes.string.isRequired,
};

CardAuthor.defaultProps = {
    contentLink: null,
};

export default CardAuthor;
