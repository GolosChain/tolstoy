import { connect } from 'react-redux';
import { postCardSelector } from 'src/app/redux/selectors/post/commonPost';
import { toggleFavorite } from 'src/app/redux/actions/favorites';
import { togglePin } from 'src/app/redux/actions/pinnedPosts';
import { openRepostDialog } from 'src/app/redux/actions/dialogs';
import PostCard from './PostCard';

export default connect(
    postCardSelector,
    {
        toggleFavorite,
        togglePin,
        openRepostDialog,
    }
)(PostCard);
