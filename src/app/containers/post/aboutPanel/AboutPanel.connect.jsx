import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { authorSelector, currentPostSelector } from 'src/app/redux/selectors/post/commonPost';
import { AboutPanel } from 'src/app/containers/post/aboutPanel/AboutPanel';
import { openTransferDialog } from 'src/app/redux/actions/dialogs';

export default connect(
    createSelector([authorSelector, currentPostSelector], (author, post) => ({
        name: author.name,
        account: author.account,
        about: author.about,
        created: author.created,
        url: post.url,
    })),
    {
        openDonateDialog: (toAccount, url) =>
            openTransferDialog(toAccount, {
                type: 'donate',
                donatePostUrl: url,
            }),
    }
)(AboutPanel);
