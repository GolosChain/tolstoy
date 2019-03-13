import { connect } from 'react-redux';

//import { toggleFavorite } from 'app/redux/actions/favorites';

import CompactPostCardMenu from './CompactPostCardMenu';

export default connect(
  null,
  {
    toggleFavorite: () => {},
  }
)(CompactPostCardMenu);
