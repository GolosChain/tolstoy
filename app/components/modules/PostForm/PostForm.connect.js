import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { currentUsernameSelector, parseJSON } from 'src/app/redux/selectors/common';
import transaction from 'app/redux/Transaction';
import PostForm from './PostForm';
import { postSelector } from 'src/app/redux/selectors/post/commonPost';

const editPostSelector = createSelector(
    [(state, props) => postSelector(state, `${props.author}/${props.permLink}`)],
    postData => ({
        parentPermLink: postData.get('parent_permlink'),
        category: postData.get('category'),
        title: postData.get('title'),
        body: postData.get('body'),
        jsonMetadata: parseJSON(postData.get('json_metadata')),
    })
);

export default connect(
    (state, props) => {
        if (props.editMode) {
            return editPostSelector(state, props);
        } else {
            return {
                author: currentUsernameSelector(state),
            };
        }
    },
    dispatch => ({
        onPost(payload, onSuccess, onError) {
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'comment',
                    operation: payload,
                    hideErrors: true,
                    errorCallback: onError,
                    successCallback: onSuccess,
                })
            );
        },
        uploadImage({ file, progress }) {
            dispatch({
                type: 'user/UPLOAD_IMAGE',
                payload: {
                    file,
                    progress: data => {
                        if (data && data.error) {
                            dispatch({
                                type: 'ADD_NOTIFICATION',
                                payload: {
                                    message: data.error,
                                    dismissAfter: 5000,
                                },
                            });
                        }

                        progress(data);
                    },
                },
            });
        },
    })
)(PostForm);
