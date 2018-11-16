import { fromJS } from 'immutable';
import { UI_SET_WALLET_TAB_STATE, UI_SET_WALLET_TABS_STATE } from 'src/app/redux/constants/ui';
import {
    MAIN_TABS,
    CURRENCY,
    DIRECTION,
    REWARDS_TYPES,
} from 'src/app/containers/userProfile/wallet/WalletContent/WalletContent';

const initialState = fromJS({
    tabsState: {
        mainTab: MAIN_TABS.TRANSACTIONS,
        currency: CURRENCY.ALL,
        direction: DIRECTION.ALL,
        rewardType: REWARDS_TYPES.CURATORIAL,
    },
});

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case UI_SET_WALLET_TAB_STATE:
            return state.setIn(['tabsState', payload.tab.key], payload.tab[payload.tab.key]);
        case UI_SET_WALLET_TABS_STATE:
            return state.set('tabsState', fromJS(payload.tabs));
    }

    return state;
}
