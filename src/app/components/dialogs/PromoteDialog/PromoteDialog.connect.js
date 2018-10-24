import { connect } from 'react-redux';

import transaction from 'app/redux/Transaction';
import { showNotification } from 'src/app/redux/actions/ui';
import { fetchPathStateAction } from 'src/app/redux/actions/fetch';
import { currentAccountSelector } from 'src/app/redux/selectors/common';
import { sanitizeCardPostData } from 'src/app/redux/selectors/post/commonPost';
import RepostDialog from './PromoteDialog';

export default connect(
    (state, props) => {
        const post = state.global.getIn(['content', props.postLink]);

        const myAccount = currentAccountSelector(state);

        return {
            myAccountName: myAccount.get('name'),
            balance: myAccount.get('sbd_balance').split(' ')[0],
            sanitizedPost: sanitizeCardPostData(post),
        };
    },
    dispatch => ({
        promote: ({ amount, author, permLink, myAccountName, password, onSuccess, onError }) => {
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'transfer',
                    operation: {
                        from: myAccountName,
                        to: 'null',
                        amount,
                        memo: `@${author}/${permLink}`,
                    },
                    username: myAccountName,
                    password,
                    successCallback: () => {
                        dispatch(fetchPathStateAction(`@${myAccountName}/transfers`));
                        onSuccess();
                    },
                    errorCallback: onError,
                })
            );
        },
        showNotification(data) {
            dispatch(showNotification(data));
        },
    })
)(RepostDialog);
