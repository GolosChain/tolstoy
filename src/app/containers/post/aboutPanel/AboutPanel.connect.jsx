import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { authorSelector, currentPostSelector } from 'src/app/redux/selectors/post/commonPost';
import { AboutPanel } from 'src/app/containers/post/aboutPanel/AboutPanel';
import { openTransferDialog } from 'src/app/redux/actions/dialogs';

export default connect(
    createSelector([authorSelector, currentPostSelector], (author, post) => {
        // set account join date
        let { created } = author;
        const transferFromSteemToGolosDate = '2016-09-29T12:00:00';
        if (new Date(created) < new Date(transferFromSteemToGolosDate)) {
            created = transferFromSteemToGolosDate;
        }

        return {
            name: author.name,
            account: author.account,
            about: author.about,
            url: post.url,
            created,
        };
    }),
    {
        openDonateDialog: (toAccount, url) =>
            openTransferDialog(toAccount, {
                type: 'donate',
                donatePostUrl: url,
            }),
    }
)(AboutPanel);
