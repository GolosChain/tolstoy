import { connect } from 'react-redux';

import user from 'app/redux/User';
import { LIQUID_TICKER } from 'app/client_config';
import { createDeepEqualSelector } from 'src/app/redux/selectors/common';
import { authorSelector, currentPostSelector } from 'src/app/redux/selectors/post/commonPost';
import { AboutPanel } from 'src/app/containers/post/aboutPanel/AboutPanel';

const selector = createDeepEqualSelector([authorSelector, currentPostSelector], (author, post) => {
    return {
        name: author.name,
        account: author.account,
        about: author.about,
        created: author.created,
        url: post.url,
    };
});

const mapDispatchToProps = dispatch => ({
    showTransfer(account, url) {
        dispatch(
            user.actions.setTransferDefaults({
                flag: {
                    type: `donate`,
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
});

export default connect(
    selector,
    mapDispatchToProps
)(AboutPanel);
