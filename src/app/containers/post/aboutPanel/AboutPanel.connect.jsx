import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import user from 'app/redux/User';
import { LIQUID_TICKER } from 'app/client_config';
import { authorSelector, currentPostSelector } from 'src/app/redux/selectors/post/commonPost';
import { AboutPanel } from 'src/app/containers/post/aboutPanel/AboutPanel';

export default connect(
    createSelector([authorSelector, currentPostSelector], (author, post) => ({
        name: author.name,
        account: author.account,
        about: author.about,
        created: author.created,
        url: post.url,
    })),

    dispatch => ({
        showTransfer(account, url) {
            dispatch(
                user.actions.setTransferDefaults({
                    flag: {
                        type: 'donate',
                        fMemo: () => JSON.stringify({ donate: { post: url } }),
                    },
                    to: account,
                    asset: LIQUID_TICKER,
                    transferType: 'Transfer to Account',
                    disableMemo: false,
                    disableTo: true,
                })
            );
            dispatch(user.actions.showTransfer());
        },
    })
)(AboutPanel);
