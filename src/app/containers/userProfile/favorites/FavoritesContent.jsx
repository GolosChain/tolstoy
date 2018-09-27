import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import tt from 'counterpart';
import { Helmet } from 'react-helmet';

import { authProtection } from 'src/app/helpers/hoc';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import PostsListFavorite from 'src/app/components/common/PostsList/PostsListFavorite';
import InfoBlock from 'src/app/components/common/InfoBlock';
import { favoritesLoadNextPageAction } from 'src/app/redux/actions/favorites';
import EmptyBlock, { EmptySubText } from 'src/app/components/common/EmptyBlock';

const Loader = styled(LoadingIndicator)`
    margin-top: 30px;
`;

@authProtection()
@connect(
    (state, props) => {
        const pageAccountName = props.params.accountName.toLowerCase();
        const isOwner = state.user.getIn(['current', 'username']) === pageAccountName;

        const { isLoading, isPageLoading, showList } = state.data.favorites;

        return {
            isOwner,
            isLoading,
            pageAccountName,
            isPageLoading,
            list: showList,
        };
    },
    {
        favoritesLoadNextPageAction,
    }
)
export default class FavoritesContent extends Component {
    componentDidMount() {
        const { isPageLoading, list } = this.props;
        if (!isPageLoading && !list) {
            this.props.favoritesLoadNextPageAction();
        }
    }

    render() {
        const { pageAccountName } = this.props;

        return (
            <Fragment>
                <Helmet>
                    <title>{tt('meta.title.profile.favorites', { name: pageAccountName })}</title>
                </Helmet>
                {this._render()}
            </Fragment>
        );
    }

    _render() {
        if (!process.env.BROWSER) {
            return <Loader type="circle" center size={40} />;
        }

        const { isOwner, list, isLoading, pageAccountName } = this.props;

        if (!isOwner) {
            return <InfoBlock>Избранное является приватными данными</InfoBlock>;
        }

        if (!list || isLoading) {
            return <Loader type="circle" center size={40} />;
        }

        if (!list.size) {
            return (
                <InfoBlock>
                    <EmptyBlock>
                        Пока нет избранных постов
                        <EmptySubText>
                            Нажми на звездочку у поста. чтобы добавить пост в избранное.
                        </EmptySubText>
                    </EmptyBlock>
                </InfoBlock>
            );
        }

        return <PostsListFavorite pageAccountName={pageAccountName} />;
    }
}
