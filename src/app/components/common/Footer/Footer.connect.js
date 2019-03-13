import { connect } from 'react-redux';

import Footer from './Footer';

export default connect(() => ({
  currentSupply: '1500',
}))(Footer);
