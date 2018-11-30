import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import tt from 'counterpart';
import { Link } from 'react-router';

import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import BlogCardsList from 'src/app/components/common/CardsList/BlogCardsList';
import InfoBlock from 'src/app/components/common/InfoBlock';
import EmptyBlock, { EmptySubText } from 'src/app/components/common/EmptyBlock';
import CardsListWrapper from '../CardsListWrapper';
import { uiSelector } from 'src/app/redux/selectors/common';

const Loader = styled(LoadingIndicator)`
    margin-top: 30px;
`;

class BlogContent extends Component {
    render() {
        const { pageAccount, layout } = this.props;

        return (
            <Fragment>
                <Helmet title={tt('meta.title.profile.blog', { name: pageAccount.get('name') })} />
                <CardsListWrapper noGaps={layout === 'compact'}>{this._render()}</CardsListWrapper>
            </Fragment>
        );
    }

    _render() {
        const { pageAccount } = this.props;

        const posts = pageAccount.get('blog');

        if (!posts) {
            return <Loader type="circle" center size={40} />;
        }

        if (!posts.size) {
            return this._renderCallOut();
        }

        return (
            <BlogCardsList
                pageAccountName={pageAccount.get('name')}
                order="by_author"
                category="blog"
                showPinButton
                //showSpam TODO
            />
        );
    }

    _renderCallOut() {
        const { isOwner } = this.props;

        return (
            <InfoBlock>
                <EmptyBlock>
                    {tt('g.empty')}
                    <EmptySubText>
                        {isOwner ? (
                            <Fragment>
                                {tt('content.tip.blog.start_writing')}{' '}
                                <Link to="/submit">{`#${tt('content.tip.blog.tag_1')}`}</Link>{' '}
                                <Link to="/submit">{`#${tt('content.tip.blog.tag_2')}`}</Link>
                                {tt('content.tip.blog.start_writing_2')}
                            </Fragment>
                        ) : (
                            tt('content.tip.blog.user_has_no_post')
                        )}
                    </EmptySubText>
                </EmptyBlock>
            </InfoBlock>
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
        layout: uiSelector('profile', 'layout')(state),
    };
})(BlogContent);
