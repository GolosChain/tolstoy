import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'mocks/react-router';
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
  margin: 0;
  padding-bottom: 30px;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  text-align: center;
  color: #333;

  @media (max-width: 576px) {
    padding-bottom: 20px;
    font-size: 16px;
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

export default class NoPostPlaceholder extends Component {
  render() {
    const { order, tagsStr, accountName } = this.props;
    const link = order === 'feed' ? `/@${accountName}/${order}` : `/${order}`;

    return (
      <Wrapper>
        <Header>
          {tt('g.no_topics_by_order_found', { order: tt(['g', order]) })}
          {tagsStr && (
            <Fragment>
              {tt('g.with_the_tag')}
              <Tag>{`#${tagsStr}`}</Tag>
            </Fragment>
          )}
        </Header>
        {tagsStr ? (
          <RemoveTagsButton to={link}>{tt('aria_label.reset_tags')}</RemoveTagsButton>
        ) : null}
        <Image src="/images/post/no_content.svg" alt="" />
      </Wrapper>
    );
  }
}
