import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { currentUsernameSelector } from 'app/redux/selectors/common';
// import { popoverUserInfoSelector } from 'app/redux/selectors/post/commonPost';
// import { USER_PINNED_POSTS_LOAD } from 'app/redux/constants/pinnedPosts';
// import { loadUserFollowData } from 'app/redux/actions/followers';
import { PopoverBody } from 'containers/post/popoverBody/PopoverBody';
import { repLog10 } from 'utils/ParsersAndFormatters';

export default connect(
  // createSelector(
  //     [popoverUserInfoSelector, currentUsernameSelector],
  //     (author, currentUsername) => ({
  //         account: author.account,
  //         name: author.name,
  //         about: author.about,
  //         followersCount: author.followerCount,
  //         pinnedPosts: author.pinnedPosts,
  //         pinnedPostsUrls: author.pinnedPostsUrls,
  //         showFollowBlock: author.account !== currentUsername,
  //         reputation: repLog10(author.accountReputation),
  //     })
  // ),
  () => ({
    account: 'account',
    name: 'name',
    about: 'about',
    followersCount: 0,
    pinnedPosts: [],
    pinnedPostsUrls: [],
    showFollowBlock: false,
    reputation: repLog10(123),
  }),
  {
    getPostContent: urls => ({
      //type: USER_PINNED_POSTS_LOAD,
      type: 'USER_PINNED_POSTS_LOAD',
      payload: {
        urls,
      },
    }),
    loadUserFollowData: () => {},
  }
)(PopoverBody);