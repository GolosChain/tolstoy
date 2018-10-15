import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CombinedComment from 'src/app/components/post/CombinedComment';

export class CommentsList extends Component {
    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        structuredComments: PropTypes.array.isRequired,
        saveListScrollPosition: PropTypes.func.isRequired,
    };

    render() {
        const { isFetching, structuredComments, saveListScrollPosition } = this.props;
        return structuredComments.map((comment, index) => (
            <CombinedComment
                key={index}
                comment={comment}
                saveListScrollPosition={saveListScrollPosition}
            />
        ));
    }
}
