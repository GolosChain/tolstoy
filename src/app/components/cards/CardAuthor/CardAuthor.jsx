import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Userpic from 'app/components/elements/Userpic';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';

const Wrapper = styled.div`
    display: flex;
    align-items: center;

    margin-right: 18px;
`;

const Avatar = styled(Link)`
    display: flex;
    margin-right: 10px;
    border-radius: 50%;
`;

const PostDesc = styled.div`
    font-family: ${a => a.theme.fontFamily};
`;

const AuthorName = styled(Link)`
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    text-decoration: none;
`;

const PostDate = styled.div`
    font-size: 13px;
    letter-spacing: 0.4px;
    line-height: 1.5;
    white-space: nowrap;
    color: #959595;
    cursor: default;
`;

const CardAuthor = ({ author, created }) => (
    <Wrapper>
        <Avatar to={`/@${author}`}>
            <Userpic account={author} size={37} />
        </Avatar>
        <PostDesc>
            <AuthorName to={`/@${author}`}>{author}</AuthorName>
            <PostDate>
                <TimeAgoWrapper date={created} />
            </PostDate>
        </PostDesc>
    </Wrapper>
);

CardAuthor.propTypes = {
    author: PropTypes.string.isRequired,
};

export default CardAuthor;
