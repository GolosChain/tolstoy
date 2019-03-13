import { connect } from 'react-redux';

import ResetKeysDialog from './ResetKeysDialog';

export default connect(
  (state, props) => ({
    account: state.global.getIn(['accounts', props.user]),
  }),
  null
)(ResetKeysDialog);
