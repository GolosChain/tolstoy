import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Userpic from 'app/components/elements/Userpic';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
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

const AuthorName = styled(Link)`
    font-size: 14px;
    font-weight: 500;
    color: #333;
    text-decoration: none;
`;

const CommentAuthor = ({ author }) => (
    <Wrapper>
        <AvatarLink to={`/@${author}`} aria-label={tt('aria_label.avatar')}>
            <Userpic account={author} size={37} />
        </AvatarLink>
        <PostDesc>
            <AuthorLine>
                <AuthorName to={`/@${author}`}>{author}</AuthorName>
            </AuthorLine>
        </PostDesc>
    </Wrapper>
);

CommentAuthor.propTypes = {
    author: PropTypes.string.isRequired,
};

export default CommentAuthor;
