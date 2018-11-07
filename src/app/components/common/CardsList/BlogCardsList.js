import { connect } from 'react-redux';

import CardsList from './CardsList.connect';

export default connect(
    (state, props) => ({
        globalStatus: state.global.get('status'),
        layout: (state.ui.profile && state.ui.profile.get('layout')) || 'list',
        items: state.global.getIn(['accounts', props.pageAccountName, props.category]),
    }),
    {
        loadMore: params => ({ type: 'REQUEST_DATA', payload: params }),
    }
)(CardsList);
