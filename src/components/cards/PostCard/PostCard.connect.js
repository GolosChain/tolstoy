import { connect } from 'react-redux';
// import { postCardSelector } from 'app/redux/selectors/post/commonPost';
// import { toggleFavorite } from 'app/redux/actions/favorites';
// import { togglePin } from 'app/redux/actions/pinnedPosts';
// import { openRepostDialog } from 'app/redux/actions/dialogs';
import PostCard from './PostCard';

export default connect(
  // postCardSelector,
  () => ({}),
  {
    toggleFavorite: () => {},
    togglePin: () => {},
    openRepostDialog: () => {},
  }
)(PostCard);
