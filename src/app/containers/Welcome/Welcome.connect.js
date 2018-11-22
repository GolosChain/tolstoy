import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import user from 'app/redux/User';
import { Welcome } from 'src/app/containers/Welcome/Welcome';
import { FAVORITES_LOAD } from 'src/app/redux/constants/favorites';

export default connect(
    null,
    dispatch => ({
        getContent: payload =>
            new Promise((resolve, reject) => {
                dispatch({
                    type: 'GET_CONTENT',
                    payload: { ...payload, resolve, reject },
                });
            }),
        getAccount: payload =>
            new Promise((resolve, reject) => {
                dispatch(user.actions.getAccount({ ...payload, resolve, reject }));
            }),
        loadFavorites: () => {
            dispatch({
                type: FAVORITES_LOAD,
                payload: {},
            });
        },
    })
)(Welcome);
