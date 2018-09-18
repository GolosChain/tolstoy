import React, { Component } from 'react';
import styled from 'styled-components';
import MarkdownViewer from '../../../../app/components/cards/MarkdownViewer';
import Tag from '../golos-ui/Tag/Tag';
import PostHeader from './PostHeader';
import { connect } from 'react-redux';
import { currentPostSelector } from '../../redux/selectors/post/post';

const Wrapper = styled.section`
    padding: 40px 70px 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: 576px) {
        padding: 15px 16px;
    }
`;

const Body = styled.div`
    margin-top: 27px;
`;

const PostTitle = styled.h1`
    margin-top: 20px;
    color: #333333;
    font: 34px 'Open Sans', sans-serif;
    font-weight: bold;
    letter-spacing: 0.37px;
    line-height: 41px;
`;

const PostBody = styled.div`
    padding: 12px 0 14px;

    p {
        color: #959595;
        font-family: 'Open Sans', sans-serif;
        font-size: 18px;
        letter-spacing: -0.29px;
        line-height: 26px;
    }

    @media (max-width: 576px) {
        font-size: 16px;
        letter-spacing: -0.26px;
        line-height: 24px;
    }
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
    render() {
        const {
            tags,
            payout,
            permLink,
            category,
            title,
            body,
            jsonMetadata,
            pictures,
            created,
            className,
        } = this.props;
        const formId = `postFull-${permLink}`;
        return (
            <Wrapper className={className}>
                <PostHeader />
                <Body>
                    <Tag category>{category}</Tag>
                    <PostTitle>{title}</PostTitle>
                    <PostBody>
                        <MarkdownViewer
                            formId={formId + '-viewer'}
                            text={body}
                            jsonMetadata={jsonMetadata}
                            large
                            highQualityPost={payout > 10}
                            noImage={!pictures}
                            timeCteated={new Date(created)}
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

const mapStateToProps = (state, props) => {
    const post = currentPostSelector(state, props);
    return {
        tags: post.tags,
        payout: post.payout,
        data: post.data,
        category: post.category,
        title: post.title,
        body: post.body,
        jsonMetadata: post.jsonMetadata,
        pictures: post.pictures,
        created: post.created,
        permLink: post.permLink,
    };
};

export default connect(mapStateToProps)(PostContent);
