import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import tt from 'counterpart';

import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import BlogCardsList from 'src/app/components/common/CardsList/BlogCardsList';
import InfoBlock from 'src/app/components/common/InfoBlock';
import EmptyBlock, { EmptySubText } from 'src/app/components/common/EmptyBlock';
import CommentCard from 'src/app/components/cards/CommentCard';
import CardsListWrapper from '../CardsListWrapper';

const Loader = styled(LoadingIndicator)`
    margin-top: 30px;
`;

class CommentsContent extends Component {
    render() {
        const { pageAccount } = this.props;

        return (
            <Fragment>
                <Helmet
                    title={tt('meta.title.profile.comments', { name: pageAccount.get('name') })}
                />
                <CardsListWrapper>{this._render()}</CardsListWrapper>
            </Fragment>
        );
    }

    renderItem(props) {
        return <CommentCard {...props} showSpam />;
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
            <BlogCardsList
                pageAccountName={pageUserName}
                category="comments"
                itemRender={this.renderItem}
                disallowGrid
                allowInlineReply={!isOwner}
                order="by_comments"
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
