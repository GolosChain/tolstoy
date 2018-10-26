import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import tt from 'counterpart';

import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import PostsListBlog from 'src/app/components/common/PostsList/PostsListBlog';
import InfoBlock from 'src/app/components/common/InfoBlock';
import EmptyBlock, { EmptySubText } from 'src/app/components/common/EmptyBlock';

const Loader = styled(LoadingIndicator)`
    margin-top: 30px;
`;

class CommentsContent extends Component {
    render() {
        const { pageAccount } = this.props;

        return (
            <Fragment>
                <Helmet>
                    <title>
                        {tt('meta.title.profile.comments', { name: pageAccount.get('name') })}
                    </title>
                </Helmet>
                {this._render()}
            </Fragment>
        );
    }

    _render() {
        const { pageAccount, isOwner } = this.props;

        const posts = pageAccount.get('posts') || pageAccount.get('comments');

        if (!posts) {
            return <Loader type="circle" center size={40} />;
        }

        const pageUserName = pageAccount.get('name');

        if (!posts.size) {
            return (
                <InfoBlock>
                    <EmptyBlock>
                        {tt('g.empty')}
                        <EmptySubText>
                            {isOwner
                                ? tt('content.tip.comments.start_writing')
                                : tt('content.tip.comments.user_has_no_comments')}
                        </EmptySubText>
                    </EmptyBlock>
                </InfoBlock>
            );
        }

        return (
            <PostsListBlog
                pageAccountName={pageUserName}
                category="comments"
                allowInlineReply={!isOwner}
                //order="by_author"
                //showSpam TODO
            />
        );
    }
}

export default connect((state, props) => {
    const pageAccountName = props.params.accountName.toLowerCase();
    const pageAccount = state.global.getIn(['accounts', pageAccountName]);
    const isOwner = state.user.getIn(['current', 'username']) === pageAccountName;

    return {
        pageAccount,
        isOwner,
    };
})(CommentsContent);
