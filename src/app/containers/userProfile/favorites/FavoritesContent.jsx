import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import tt from 'counterpart';
import { Helmet } from 'react-helmet';

import { authProtection } from 'src/app/helpers/hoc';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import FavoritePostsList from 'src/app/components/common/CardsList/FavoritePostsList';
import InfoBlock from 'src/app/components/common/InfoBlock';
import { favoritesLoadNextPageAction } from 'src/app/redux/actions/favorites';
import EmptyBlock, { EmptySubText } from 'src/app/components/common/EmptyBlock';
import CardsListWrapper from '../CardsListWrapper';

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
                <Helmet title={tt('meta.title.profile.favorites', { name: pageAccountName })} />
                <CardsListWrapper noGaps>{this._render()}</CardsListWrapper>
            </Fragment>
        );
    }

    _render() {
        if (!process.env.BROWSER) {
            return <Loader type="circle" center size={40} />;
        }

        const { isOwner, list, isLoading, pageAccountName } = this.props;

        if (!isOwner) {
            return <InfoBlock>{tt('favorites.info_block')}</InfoBlock>;
        }

        if (!list || isLoading) {
            return <Loader type="circle" center size={40} />;
        }

        if (!list.size) {
            return (
                <InfoBlock>
                    <EmptyBlock>
                        {tt('favorites.empty_block')}
                        <EmptySubText>{tt('favorites.empty_sub_text')}</EmptySubText>
                    </EmptyBlock>
                </InfoBlock>
            );
        }

        return <FavoritePostsList pageAccountName={pageAccountName} />;
    }
}
