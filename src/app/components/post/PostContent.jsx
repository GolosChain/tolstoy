import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import MarkdownViewer from '../../../../app/components/cards/MarkdownViewer';
import { parsePayoutAmount } from '../../../../app/utils/ParsersAndFormatters';
import Tag from '../golos-ui/Tag/Tag';
import PostHeader from './PostHeader';

const Wrapper = styled.div`
    padding: 40px 70px 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5), 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const Body = styled.div`
    margin-top: 27px;
`;

const PostTitle = styled.div`
    margin-top: 20px;
    color: #333333;
    font: 34px 'Open Sans', sans-serif;
    font-weight: bold;
    letter-spacing: 0.37px;
    line-height: 41px;
`;

const PostBody = styled.div`
    padding: 12px 0 14px;
`;
const Tags = styled.div`
    margin-top: -10px;
    display: flex;
    flex-wrap: wrap;
    & > div {
        margin: 10px 10px 0 0;
    }
`;

class PostContent extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
        userName: PropTypes.string,
        isFavorite: PropTypes.bool.isRequired,
        onFavoriteClick: PropTypes.func.isRequired,
        changeFollow: PropTypes.func.isRequired,
        isFollow: PropTypes.bool,
    };

    static defaultProps = {
        isFollow: false,
    };

    render() {
        const {
            post,
            userName,
            isFavorite,
            onFavoriteClick,
            isFollow,
            changeFollow,
            className,
        } = this.props;
        const formId = `postFull-${post}`;
        const tags = JSON.parse(post.get('json_metadata')).tags;
        const payout =
            parsePayoutAmount(post.get('pending_payout_value')) +
            parsePayoutAmount(post.get('total_payout_value'));
        // console.log(post);
        return (
            <Wrapper className={className}>
                <PostHeader
                    post={post}
                    userName={userName}
                    isFavorite={isFavorite}
                    onFavoriteClick={onFavoriteClick}
                    isFollow={isFollow}
                    changeFollow={changeFollow}
                />
                <Body>
                    <Tag category>{post.get('category')}</Tag>
                    <PostTitle>{post.get('title')}</PostTitle>
                    <PostBody>
                        <MarkdownViewer
                            formId={formId + '-viewer'}
                            text={post.get('body')}
                            jsonMetadata={post.get('json_metadata')}
                            large
                            highQualityPost={payout > 10}
                            noImage={!post.getIn(['stats', 'pictures'])}
                            timeCteated={new Date(post.get('created'))}
                        />
                    </PostBody>
                </Body>
                <Tags>
                    {tags.map((tag, index) => (
                        <Tag category={index === 0} key={index}>
                            {tag}
                        </Tag>
                    ))}
                </Tags>
            </Wrapper>
        );
    }
}

export default PostContent;
