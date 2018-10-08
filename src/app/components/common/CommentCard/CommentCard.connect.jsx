import { connect } from 'react-redux';
import tt from 'counterpart';

import extractContent from 'app/utils/ExtractContent';
import { immutableAccessor } from 'app/utils/Accessors';

import user from 'app/redux/User';
import transaction from 'app/redux/Transaction';
import { CommentCard } from './CommentCard';

export default connect(
    (state, props) => {
        const data = state.global.getIn(['content', props.permLink]);
        const dataToJS = data.toJS();
        const content = extractContent(immutableAccessor, data);
        const htmlContent = { __html: content.desc };
        const myAccountName = state.user.getIn(['current', 'username']);
        const isOwner =
            state.user.getIn(['current', 'username']) === props.pageAccountName.toLowerCase();

        let parentLink = content.link;
        let title = content.title;

        if (dataToJS.parent_author) {
            title = dataToJS.root_title;
            parentLink = `/${dataToJS.category}/@${dataToJS.parent_author}/${
                dataToJS.parent_permlink
            }`;
        }

        return {
            data,
            title,
            parentLink,
            htmlContent,
            dataToJS,
            content,
            isOwner,
            myAccountName,
        };
    },
    dispatch => ({
        onVote: (percent, { myAccountName, author, permlink }) => {
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'vote',
                    operation: {
                        voter: myAccountName,
                        author,
                        permlink,
                        weight: percent * 10000,
                        __config: {
                            title: percent < 0 ? tt('voting_jsx.confirm_flag') : null,
                        },
                    },
                    successCallback: () => dispatch(user.actions.getAccount()),
                })
            );
        },
        onNotify: text => {
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                    message: text,
                    dismissAfter: 5000,
                },
            });
        },
    })
)(CommentCard);
