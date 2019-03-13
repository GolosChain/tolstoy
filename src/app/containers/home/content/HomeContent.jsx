import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'mocks/react-router';
import tt from 'counterpart';
import styled from 'styled-components';

import { APP_NAME } from 'src/app/client_config';

import CardsList from 'src/app/components/common/CardsList';
import NoPostsPlaceholder from 'src/app/components/home/NoPostsPlaceholder';

const Wrapper = styled.div`
  background-color: #f9f9f9;
`;

const Callout = styled.div`
  padding: 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 3px;
  background-color: white;
`;

export default class HomeContent extends Component {
  static propTypes = {
    // router
    routeParams: PropTypes.object,

    // connect
    posts: PropTypes.array,
    currentUsername: PropTypes.string,
    isFetching: PropTypes.bool,
    category: PropTypes.string,
    order: PropTypes.string,
    layout: PropTypes.oneOf(['list', 'grid', 'compact']),
    loadMore: PropTypes.func,
  };

  static defaultProps = {
    posts: [],
  };

  renderCallout() {
    const { category, order, currentUsername, routeParams, tagsStr } = this.props;

    let accountName = null;
    // TODO: Where is routeParams?
    if (routeParams && routeParams.order) {
      accountName = routeParams.order.slice(1);
    }

    if (category !== 'feed') {
      return <NoPostsPlaceholder order={order} tagsStr={tagsStr} accountName={accountName} />;
    }

    const isMyAccount = currentUsername === accountName;
    if (isMyAccount) {
      return (
        <div>
          {tt('user_profile.user_hasnt_followed_anything_yet', {
            name: accountName,
          })}
          <br />
          <br />
          {tt('user_profile.if_you_recently_added_new_users_to_follow')}
          <br />
          <br />
          <Link to="/trending">{tt('user_profile.explore_APP_NAME', { APP_NAME })}</Link>
          <br />
          <Link to="/welcome">{tt('submit_a_story.welcome_to_the_blockchain')}</Link>
          <br />
          <a href="https://golos.io/ru--golos/@bitcoinfo/samyi-polnyi-f-a-q-o-golose-spisok-luchshykh-postov-raskryvayushikh-vse-aspekty-proekta-bonusy-v-vide-kreativa">
            {tt('user_profile.full_faq', { APP_NAME })}
          </a>
        </div>
      );
    }

    return (
      <div>
        {tt('user_profile.user_hasnt_followed_anything_yet', {
          name: accountName,
        })}
      </div>
    );
  }

  render() {
    const { isFetching, posts, order, category, layout, loadMore, routeParams } = this.props;

    if (!isFetching && posts && !posts.size) {
      return <Callout>{this.renderCallout()}</Callout>;
    }

    let pageAccountName = null;

    if (routeParams.category === 'feed') {
      pageAccountName = routeParams.order.replace('@', '');
    }

    return (
      <Wrapper>
        <CardsList
          pageAccountName={pageAccountName}
          items={posts}
          order={order}
          category={category}
          isLoading={isFetching}
          hideIgnored
          //showSpam

          layout={layout}
          loadMore={loadMore}
        />
      </Wrapper>
    );
  }
}
