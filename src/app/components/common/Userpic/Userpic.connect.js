import { connect } from 'react-redux';

import Userpic from './Userpic';

export default connect((state, props) => ({
    jsonMetadata: state.global.getIn(['accounts', props.account, 'json_metadata']),
}))(Userpic);
