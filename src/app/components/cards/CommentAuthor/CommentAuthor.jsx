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

const AuthorName = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #333;
    text-decoration: none;
`;

const AuthorNameLink = AuthorName.withComponent(Link);

const CommentAuthor = ({ author, noLinks }) => {
    let AvatarComp = AvatarLink;
    let AuthorNameComp = AuthorNameLink;

    if (noLinks) {
        AvatarComp = Avatar;
        AuthorNameComp = AuthorName;
    }

    return (
        <Wrapper>
            <AvatarComp to={`/@${author}`} aria-label={tt('aria_label.avatar')}>
                <Userpic account={author} size={37} />
            </AvatarComp>
            <PostDesc>
                <AuthorLine>
                    <AuthorNameComp to={`/@${author}`}>{author}</AuthorNameComp>
                </AuthorLine>
            </PostDesc>
        </Wrapper>
    );
};

CommentAuthor.propTypes = {
    author: PropTypes.string.isRequired,
};

export default CommentAuthor;
