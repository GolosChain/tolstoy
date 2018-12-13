import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { globalSelector } from 'src/app/redux/selectors/common';
import { getUserStatus } from 'src/app/helpers/users';
import UserStatus from './UserStatus';

const selector = createSelector(
    [(state, props) => globalSelector(['accounts', props.currentAccount.get('name')])(state)],
    user => {
        const power = parseFloat(user.get('vesting_shares')).toFixed(3);
        return {
            userStatus: getUserStatus(power),
            power,
        };
    }
);

export default connect(selector)(UserStatus);
