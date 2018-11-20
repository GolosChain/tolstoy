import { connect } from 'react-redux';

import CheckLoginOwner from './CheckLoginOwner';

export default connect(
    state => {
        const current = state.user.get('current');
        const loginOwnerPubKey = current && current.get('login_owner_pubkey');
        const previousOwnerAuthority = current && current.get('previous_owner_authority');

        return {
            loginOwnerPubKey,
            previousOwnerAuthority,
        };
    },
    {
        lookupPreviousOwnerAuthority: () => ({
            type: 'user/lookupPreviousOwnerAuthority',
            payload: {},
        }),
    }
)(CheckLoginOwner);
