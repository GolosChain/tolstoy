import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { globalSelector } from 'src/app/redux/selectors/common';
import UserHeader from './UserHeader';

const selector = createSelector(
    [(state, props) => globalSelector(['accounts', props.currentAccount.get('name')])(state)],
    account => ({
        power: parseFloat(account.get('vesting_shares')).toFixed(3),
    })
);

export default connect(selector)(UserHeader);
