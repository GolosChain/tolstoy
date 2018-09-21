import {createDeepEqualSelector, currentUsernameSelector} from 'src/app/redux/selectors/common';
import {currentPostSelector, authorSelector, votesSummarySelector} from 'src/app/redux/selectors/post/post';

export const sidePanelSelector = createDeepEqualSelector(
    [currentPostSelector, authorSelector, currentUsernameSelector, votesSummarySelector],
    (post, author, username, votesSummary) => {
      return {
          votesSummary,
          username,
          isFavorite: post.isFavorite,
          author: author.account,
          permLink: post.permLink,
          myVote: post.myVote,
      }
    }
);
