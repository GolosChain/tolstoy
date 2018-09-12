import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Container from 'src/app/components/common/Container/Container';
import SidePanel from 'src/app/containers/Post/SidePanel';
import {
    activePanelTooltipSelector,
    authorSelector,
    currentPostSelector,
    sidePanelSelector,
} from '../../redux/selectors/post/post';
import PostContent from '../../components/post/PostContent';
import { currentUserSelector } from '../../redux/selectors/common';
import { toggleFavoriteAction } from '../../redux/actions/favorites';
import ActivePanel from './ActivePanel';
import transaction from '../../../../app/redux/Transaction';
import AboutPanel from './AboutPanel';
import tt from 'counterpart';

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
`;

const Content = Container.extend`
    position: relative;
    padding-top: 22px;
    padding-bottom: 17px;
    display: flex;
    flex-direction: column;
`;

const ContentWrapper = styled(PostContent)``;

class PostContainer extends Component {
    constructor(props) {
        super(props);
        this.initEvents(props);
    }

    initEvents = props => {
        const { updateFollow, username, author } = props;
        const upd = type => {
            const done = () => {
                console.log('done');
            };
            updateFollow(username, author.account, type, done);
        };
        this.follow = upd.bind(null, 'blog', tt('g.confirm_follow'));
        this.unfollow = upd.bind(null, null, tt('g.confirm_unfollow'));
        this.ignore = upd.bind(null, 'ignore', tt('g.confirm_ignore'));
        this.unignore = upd.bind(null, null, tt('g.confirm_unignore'));
    };

    render() {
        const { post, username, author, sidePanelData, activePanelTooltipData } = this.props;
        if (!post) return null;
        author.follow = this.follow;
        author.unfollow = this.unfollow;
        author.ignore = this.ignore;
        author.unignore = this.unignore;
        return (
            <Wrapper>
                <Content>
                    <ContentWrapper
                        post={post}
                        username={username}
                        author={author}
                        onFavoriteClick={this._onFavoriteClick}
                    />
                    <ActivePanel
                        post={post}
                        username={username}
                        activePanelTooltipActions={activePanelTooltipData}
                        onVoteChange={this._onVoteChange}
                    />
                    <AboutPanel author={author} />
                    <SidePanel sidePanelActions={sidePanelData} />
                </Content>
            </Wrapper>
        );
    }

    _onFavoriteClick = () => {
        const { isFavorite, post, author } = this.props;

        this.props.toggleFavorite(author.account + '/' + post.permlink, !isFavorite);
    };

    _onVoteChange = async percent => {};

}

const mapStateToProps = (state, props) => {
    const post = currentPostSelector(state, props);
    return {
        post,
        username: !!post && currentUserSelector(state).get('username'),
        author: !!post && authorSelector(state, props),
        actionsData: !!post && sidePanelSelector(state, props),
        activePanelTooltipData: activePanelTooltipSelector(state, props),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleFavorite: (link, isAdd) => {
            dispatch(toggleFavoriteAction({ link, isAdd }));
        },
        updateFollow: (follower, following, done) => {
            const json = ['follow', { follower, following, what: ['blog'] }];
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'custom_json',
                    operation: {
                        id: 'follow',
                        required_posting_auths: [follower],
                        json: JSON.stringify(json),
                    },
                    successCallback: done,
                    errorCallback: done,
                })
            );
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostContainer);
