import commun from 'communjs';

import { defaults } from 'src/app/utils/common';
import { CALL_GATE } from 'src/app/store/middlewares/gate-api';
import { PROVIDE_BW, PROVIDE_BW_SUCCESS, PROVIDE_BW_ERROR } from 'store/constants';
import { currentUsernameSelector } from 'store/selectors/auth';

export const COMMUN_API = 'COMMUN_API';

export default ({ getState }) => next => async action => {
    if (!action[COMMUN_API]) {
        return next(action);
    }

    // TODO: change to providebw: true and broadcast: false when Gate will work
    const callApi = defaults(action[COMMUN_API], {
        options: { providebw: false, broadcast: true },
    });

    const actionWithoutCall = { ...action };
    delete actionWithoutCall[COMMUN_API];

    const { types, contract, method, params, options } = callApi;
    const [requestType, successType, failureType] = types;

    next({
        ...actionWithoutCall,
        type: requestType,
        payload: null,
        error: null,
    });

    try {
        const accountName = currentUsernameSelector(getState());

        // raw transaction if providebw option specified or result of transaction
        let result = await commun[contract][method]({ accountName }, params, options);

        if (options.providebw) {
            const { signatures, serializedTransaction } = result;
            const paramsProvidebw = {
                transaction: {
                    signatures,
                    serializedTransaction: Array.from(serializedTransaction),
                },
                chainId: commun.api.chainId,
            };

            result = await next({
                [CALL_GATE]: {
                    types: [PROVIDE_BW, PROVIDE_BW_SUCCESS, PROVIDE_BW_ERROR],
                    method: 'bandwidth.provide',
                    params: paramsProvidebw,
                },
                meta: paramsProvidebw,
            });
        }

        next({
            ...actionWithoutCall,
            type: successType,
            payload: result,
            error: null,
        });

        return result;
    } catch (err) {
        next({
            ...actionWithoutCall,
            type: failureType,
            payload: null,
            error: err,
        });

        throw err;
    }
};
