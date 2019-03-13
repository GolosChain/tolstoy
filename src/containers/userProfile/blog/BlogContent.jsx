import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Head from 'next/head';
import tt from 'counterpart';
import { Link } from 'mocks/react-router';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import BlogCardsList from 'components/common/CardsList/BlogCardsList';
import InfoBlock from 'components/common/InfoBlock';
import EmptyBlock, { EmptySubText } from 'components/common/EmptyBlock';
import CardsListWrapper from '../CardsListWrapper';
// import { uiSelector } from 'app/redux/selectors/common';
import { visuallyHidden } from 'helpers/styles';

const Loader = styled(LoadingIndicator)`
  margin-top: 30px;
`;

const Header = styled.h1`
  ${visuallyHidden};
`;

class BlogContent extends Component {
  render() {
    const { pageAccount, layout } = this.props;

    return (
      <Fragment>
        <Head>
          <title>
            {tt('meta.title.profile.blog', {
              name: pageAccount.get('name'),
            })}
          </title>
        </Head>
        <Header>{tt('g.blog')}</Header>
        <CardsListWrapper noGaps={layout === 'compact'}>{this._render()}</CardsListWrapper>
      </Fragment>
    );
  }

  _render() {
    const { pageAccount } = this.props;

    const posts = pageAccount.get('blog');

    if (!posts) {
      return <Loader type="circle" center size={40} />;
    }

    if (!posts.size) {
      return this._renderCallOut();
    }

    return (
      <BlogCardsList
        pageAccountName={pageAccount.get('name')}
        order="by_author"
        category="blog"
        showPinButton
        //showSpam TODO
      />
    );
  }

  _renderCallOut() {
    const { isOwner } = this.props;

    return (
      <InfoBlock>
        <EmptyBlock>
          {tt('g.empty')}
          <EmptySubText>
            {isOwner ? (
              <Fragment>
                {tt('content.tip.blog.start_writing')}{' '}
                <Link to="/submit">{`#${tt('content.tip.blog.tag_1')}`}</Link>{' '}
                <Link to="/submit">{`#${tt('content.tip.blog.tag_2')}`}</Link>
                {tt('content.tip.blog.start_writing_2')}
              </Fragment>
            ) : (
              tt('content.tip.blog.user_has_no_post')
            )}
          </EmptySubText>
        </EmptyBlock>
      </InfoBlock>
    );
  }
}

export default connect((state, props) => {
  // const pageAccountName = props.params.accountName.toLowerCase();
  // const pageAccount = state.global.getIn(['accounts', pageAccountName]);
  // const isOwner = state.user.getIn(['current', 'username']) === pageAccountName;

  return {
    pageAccount: null,
    isOwner: false,
    layout: 'list',
  };
})(BlogContent);
