import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List, OrderedSet } from 'immutable';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import is from 'styled-is';

import { getScrollElement } from 'src/app/helpers/window';
import { isFetchingOrRecentlyUpdated } from 'app/utils/StateFunctions';

import PostCard from 'src/app/components/cards/PostCard';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

const FORCE_GRID_WIDTH = 650;

const Root = styled.div`
    ${is('grid')`
        display: flex;
        flex-wrap: wrap;
        position: relative;
        margin: 0 -8px;
    `};
`;

const Loader = styled.div`
    margin-bottom: 20px;
`;

export default class CardsList extends PureComponent {
    static propTypes = {
        // external
        pageAccountName: PropTypes.string,
        order: PropTypes.string,
        category: PropTypes.string,
        items: PropTypes.instanceOf(List),
        layout: PropTypes.oneOf(['list', 'grid']),
        itemRender: PropTypes.func,
        allowInlineReply: PropTypes.bool,
        showPinButton: PropTypes.bool,
        disallowGrid: PropTypes.bool,
        hideIgnored: PropTypes.bool,
        ignoreResult: PropTypes.instanceOf(OrderedSet),

        // connect
        location: PropTypes.object,
        listScrollPosition: PropTypes.number,
    };

    static defaultProps = {
        items: List(),
        layout: 'list',
        allowInlineReply: false,
        showPinButton: false,
        hideIgnored: false,
    };

    state = {
        forceGrid: false,
    };

    rootRef = React.createRef();

    componentDidMount() {
        window.addEventListener('scroll', this.onScrollLazy);
        window.addEventListener('resize', this.onResizeLazy);

        const { location, backClickTs, listScrollPosition } = this.props;

        if (location.action === 'POP' || (backClickTs && backClickTs > Date.now() - 1000)) {
            getScrollElement().scrollTop = listScrollPosition;

            let setScrollIterations = 0;

            this._scrollIntervalId = setInterval(() => {
                getScrollElement().scrollTop = listScrollPosition;

                if (++setScrollIterations === 5) {
                    clearInterval(this._scrollIntervalId);
                }
            }, 50);
        }

        if (window.innerWidth < FORCE_GRID_WIDTH) {
            this.setState({
                forceGrid: true,
            });
        }
    }

    componentWillUnmount() {
        if (this._scrollIntervalId) {
            clearInterval(this._scrollIntervalId);
        }
        window.removeEventListener('scroll', this.onScrollLazy);
        window.removeEventListener('resize', this.onResizeLazy);
        this.onResizeLazy.cancel();
        this.onScrollLazy.cancel();
    }

    onScrollLazy = throttle(
        () => {
            const rect = this.rootRef.current.getBoundingClientRect();

            if (rect.top + rect.height < window.innerHeight * 1.5) {
                this.loadMore();
            }
        },
        100,
        { leading: false, trailing: true }
    );

    onResizeLazy = throttle(() => {
        this.setState({
            forceGrid: window.innerWidth < FORCE_GRID_WIDTH,
        });
    }, 100);

    loadMore = () => {
        const { isFavorite, items } = this.props;

        if (isFavorite) {
            const { isLoading } = this.props;

            if (!isLoading) {
                this.props.loadMore();
            }
        } else {
            const { globalStatus, order, category, pageAccountName } = this.props;

            if (isFetchingOrRecentlyUpdated(globalStatus, order, category)) {
                return;
            }

            const lastPost = items.last();
            const postLink = typeof lastPost === 'string' ? lastPost : lastPost.get('postLink');

            const [author, permlink] = postLink.split('/');

            this.props.loadMore({
                order,
                category,
                accountname: pageAccountName,
                author,
                permlink,
            });
        }
    };

    onEntryClick = () => {
        this.props.saveListScrollPosition(getScrollElement().scrollTop);
    };

    renderLoaderIfNeed() {
        const { isFavorite } = this.props; // for favorites. need to refactoring
        const { globalStatus, isLoading, category, order } = this.props;

        let showLoader;

        if (isFavorite) {
            showLoader = isLoading;
        } else {
            const status = globalStatus ? globalStatus.getIn([category || '', order]) : null;
            showLoader = (status && status.fetching) || isLoading;
        }

        if (showLoader) {
            return (
                <Loader>
                    <LoadingIndicator type="circle" center size={40} />
                </Loader>
            );
        }
    }

    checkIsIgnored = data => {
        const { ignoreResult, hideIgnored } = this.props;

        if (!hideIgnored) {
            return false;
        }

        let author;
        if (typeof data === 'string') {
            author = data.split('/')[0];
        } else {
            author = data.get('author');
        }

        return ignoreResult && ignoreResult.has(author);
    };

    itemRender(props) {
        return <PostCard {...props} />;
    }

    renderCard = data => {
        const {
            pageAccountName,
            layout,
            allowInlineReply,
            showPinButton,
            disallowGrid,
            itemRender,
        } = this.props;

        const { forceGrid } = this.state;

        const itemRenderFunc = itemRender || this.itemRender;
        const isGrid = !disallowGrid && (layout === 'grid' || forceGrid);

        let permLink;
        let additionalData = null;

        if (typeof data === 'string') {
            permLink = data;
        } else {
            permLink = data.get('postLink');
            additionalData = data.get('repostData');
        }

        if (this.checkIsIgnored(data)) {
            return null;
        }

        return itemRenderFunc({
            key: permLink,
            permLink,
            additionalData,
            grid: isGrid,
            allowInlineReply,
            pageAccountName,
            showPinButton,
            onClick: this.onEntryClick,
        });
    };

    render() {
        const { items, layout, disallowGrid } = this.props;
        const { forceGrid } = this.state;

        const isGrid = !disallowGrid && (layout === 'grid' || forceGrid);

        return (
            <Root innerRef={this.rootRef} grid={isGrid}>
                {items.map(this.renderCard)}
                {this.renderLoaderIfNeed()}
            </Root>
        );
    }
}
