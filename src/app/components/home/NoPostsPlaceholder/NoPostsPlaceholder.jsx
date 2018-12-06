import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import tt from 'counterpart';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 165px;
    overflow: hidden;

    @media (max-width: 1150px) {
        padding: 20px 40px;
    }

    @media (max-width: 439px) {
        padding: 20px;
    }
`;

const Header = styled.h2`
    font-size: 18px;
    font-weight: 500;
    color: #333;
    line-height: normal;
    margin: 0;
    padding: 0 0 30px 0;
    text-align: center;

    @media (max-width: 576px) {
        font-size: 16px;
        padding: 0 0 20px 0;
    }
`;

const RemoveTagsButton = styled(Link)`
    display: flex;
    align-items: center;
    max-width: 167px;
    padding: 8px 18px;
    margin-bottom: 20px;
    border-radius: 68px;
    background-color: #2879ff;
    cursor: pointer;
    transition: background-color 0.2s;

    font-size: 12px;
    font-weight: bold;
    line-height: 1.5;
    color: #ffffff;
    text-transform: uppercase;

    &:hover {
        background-color: #0e69ff;
        color: #ffffff;
    }

    @media (max-width: 576px) {
        margin-bottom: 15px;
    }
`;

const Image = styled.img`
    width: 100%;
    max-width: 582px;
    height: auto;
`;

const Tag = styled.span`
    color: #2879ff;
`;

class NoPostPlaceholder extends Component {
    render() {
        const { order, tagsStr } = this.props;

        return (
            <Wrapper>
                <Header>
                    {tt('g.no_topics_by_order_found', { order: `${tt('g.' + order)}` })}
                    <Tag>{`#${tagsStr}`}</Tag>
                </Header>
                <RemoveTagsButton to={window.location.pathname}>
                    {tt('aria_label.reset_tags')}
                </RemoveTagsButton>
                <Image src="/images/post/no_content.svg" />
            </Wrapper>
        );
    }
}

export default NoPostPlaceholder;
