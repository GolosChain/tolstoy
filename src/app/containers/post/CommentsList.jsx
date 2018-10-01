import React, { Component } from 'react';
import { api } from 'golos-js';
import { DEFAULT_VOTE_LIMIT } from 'app/client_config';
import CommentCard from 'src/app/components/common/CommentCard/CommentCard';

export default class CommentsList extends Component {
    state = {
        commentsArr: [],
    };

    componentDidMount() {
        this.receivePostComments().then(comments => {
            this.setState({ commentsArr: comments });
        });
    }

    render() {
        const { commentsArr } = this.state;
        const { username } = this.props;
        return (
            <div>
                {commentsArr.map((comment, index) => (
                    <CommentCard
                        key={index}
                        permLink={`${comment.author}/${comment.permlink}`}
                        allowInlineReply={true}
                        pageAccountName={comment.author}
                    />
                ))}
            </div>
        );
    }
    receivePostComments = async () => {
        const { commentAuthor, commentPermLink } = this.props;
        return await api.getAllContentRepliesAsync(
            commentAuthor,
            commentPermLink,
            DEFAULT_VOTE_LIMIT
        );
    };
}
