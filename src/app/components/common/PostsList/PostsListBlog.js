import { connect } from 'react-redux';
import PostsList from './PostsList';

export default connect(
    (state, props) => {
        return {
            globalStatus: state.global.get('status'),
            layout: state.ui.profile && state.ui.profile.get('layout') || 'list',
            posts: state.global.getIn(['accounts', props.pageAccountName, props.category]),
        };
    },
    dispatch => ({
        loadMore(params) {
            dispatch({ type: 'REQUEST_DATA', payload: params });
        },
    })
)(PostsList);
