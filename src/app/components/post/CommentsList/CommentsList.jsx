import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NestedComment from 'src/app/components/post/NestedComments';

export class CommentsList extends Component {
    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        structuredComments: PropTypes.array.isRequired,
        saveListScrollPosition: PropTypes.func.isRequired,
        updateComments: PropTypes.func.isRequired,
    };

    render() {
        const {
            isFetching,
            structuredComments,
            saveListScrollPosition,
            updateComments,
        } = this.props;
        return structuredComments.map((comment, index) => (
            <NestedComment
                key={index}
                comment={comment}
                saveListScrollPosition={saveListScrollPosition}
                updateComments={updateComments}
            />
        ));
    }
}
