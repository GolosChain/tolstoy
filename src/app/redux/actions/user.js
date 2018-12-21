import { api } from 'golos-js';

import {
    FETCH_WITNESS_DATA,
    FETCH_WITNESS_DATA_SUCCESS,
    FETCH_WITNESS_DATA_ERROR,
} from 'src/app/redux/constants/user';

export function checkWitness(accountName) {
    return dispatch => {
        dispatch({
            type: FETCH_WITNESS_DATA,
        });
        api.getWitnessByAccountAsync(accountName)
            .then(response => {
                dispatch({
                    type: FETCH_WITNESS_DATA_SUCCESS,
                    payload: {
                        [accountName]: {
                            isWitness: Boolean(response),
                            witnessData: response,
                        },
                    },
                });
            })
            .catch(error => {
                dispatch({
                    type: FETCH_WITNESS_DATA_ERROR,
                    payload: {
                        error,
                    },
                });
            });
    };
}
