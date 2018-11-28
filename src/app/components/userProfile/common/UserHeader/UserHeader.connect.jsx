import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getVestsToGolosRatio, globalSelector } from 'src/app/redux/selectors/common';
import UserHeader from './UserHeader';

const selector = createSelector(
    [
        (state, props) => globalSelector(['accounts', props.currentAccount.get('name')])(state),
        getVestsToGolosRatio,
    ],
    (account, vestsToGolosRatio) => ({
        power: (parseFloat(account.get('vesting_shares')) * vestsToGolosRatio).toFixed(3),
    })
);

export default connect(selector)(UserHeader);
