import { connect } from 'react-redux';

//import { toggleFavorite } from 'src/app/redux/actions/favorites';

import CompactPostCardMenu from './CompactPostCardMenu';

export default connect(
  null,
  {
    toggleFavorite: () => {},
  }
)(CompactPostCardMenu);
