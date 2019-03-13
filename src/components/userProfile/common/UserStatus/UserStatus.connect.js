import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Map } from 'immutable';

//import { globalSelector } from 'src/app/redux/selectors/common';
import { getUserStatus } from 'src/helpers/users';

import UserStatus from './UserStatus';

// const selector = createSelector(
//     [
//         (state, props) => {
//             const account =
//                 props.currentAccount instanceof Map
//                     ? props.currentAccount.get('name')
//                     : props.currentAccount;
//             return globalSelector(['accounts', account])(state);
//         },
//     ],
//     user => {
//         if (!user) {
//             return {};
//         }
//
//         const power = parseFloat(user.get('vesting_shares')).toFixed(3);
//         return {
//             userStatus: getUserStatus(power),
//             power,
//         };
//     }
// );

export default connect()(UserStatus);
