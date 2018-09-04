import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import MarkdownViewer from '../../../../app/components/cards/MarkdownViewer';
import { parsePayoutAmount } from '../../../../app/utils/ParsersAndFormatters';
import Tag from '../golos-ui/Tag/Tag';

const Wrapper = styled.div``;
const Header = styled.div``;

const PostWrapper = styled.div`
    margin: 27px 0 30px;
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
const TagsWrapper = styled.div``;

class Content extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
    };

    render() {
        const { className, post } = this.props;
        const formId = `postFull-${post}`;
        const payout =
            parsePayoutAmount(post.get('pending_payout_value')) +
            parsePayoutAmount(post.get('total_payout_value'));
        // console.log(post);
        return (
            <Wrapper className={className}>
                <Header />
                <PostWrapper>
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
                </PostWrapper>
                <TagsWrapper />
            </Wrapper>
        );
    }
}

export default Content;
