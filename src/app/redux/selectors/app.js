import {
    createDeepEqualSelector,
    appSelector as appStateSelector, // because of duplication
    offchainSelector,
} from './common';

// App selectors

export const newVisitorSelector = createDeepEqualSelector(
    [state => state.user, state => state.offchain],
    (user, offchain) =>
        !user.get('current') &&
        !offchain.get('user') &&
        !offchain.get('account') &&
        offchain.get('new_visit')
);

export const appSelector = createDeepEqualSelector(
    [appStateSelector('error'), offchainSelector('flash'), newVisitorSelector],
    (error, flash, newVisitor) => ({
        error,
        flash,
        newVisitor,
    })
);
