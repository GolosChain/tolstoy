import React, { Fragment } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon';
import Userpic from 'app/components/elements/Userpic';
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

const PostDate = styled.div`
    font-size: 13px;
    letter-spacing: 0.4px;
    line-height: 1.5;
    white-space: nowrap;
    color: #959595;
    cursor: default;
`;

const RepostText = styled.span`
    font-size: 14px;
    color: #757575;
`;

const RepostIcon = styled(Icon)`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 20px;
    height: 20px;
`;

const CardAuthor = ({ author, originalAuthor, created, isRepost, className, noLinks }) => {
    let AvatarComp = AvatarLink;
    let AuthorNameComp = AuthorNameLink;

    if (noLinks) {
        AvatarComp = Avatar;
        AuthorNameComp = AuthorName;
    }

    return (
        <Wrapper className={className}>
            <AvatarComp to={`/@${author}`}>
                <Userpic account={author} size={37} />
                {isRepost ? <RepostIcon name="repost" /> : null}
            </AvatarComp>
            <PostDesc>
                <AuthorLine>
                    <AuthorNameComp to={`/@${author}`}>{author}</AuthorNameComp>
                    {isRepost ? (
                        <Fragment>
                            {' '}
                            <RepostText>{tt('repost_dialog.repost_on')}</RepostText>{' '}
                            <AuthorNameComp to={`/@${originalAuthor}`}>
                                {originalAuthor}
                            </AuthorNameComp>
                        </Fragment>
                    ) : null}
                </AuthorLine>
                <PostDate>
                    <TimeAgoWrapper date={created} />
                </PostDate>
            </PostDesc>
        </Wrapper>
    );
};

CardAuthor.propTypes = {
    author: PropTypes.string.isRequired,
};

export default CardAuthor;
