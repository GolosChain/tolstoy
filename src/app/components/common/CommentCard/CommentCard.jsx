import React, { Component, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Map } from 'immutable';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';
import tt from 'counterpart';

import { detransliterate } from 'app/utils/ParsersAndFormatters';
import CommentFormLoader from 'app/components/modules/CommentForm/loader';

import CommentFooter from './CommentFooter';
import { CommentAuthor } from './CommentAuthor';
import { EditButton } from './EditButton';
import { ReLink } from './ReLink';
import { CloseOpenButton } from './CloseOpenButton';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

const Header = styled.div`
    padding: 12px 0 8px 0;
    flex-shrink: 0;

    ${isNot('isCommentOpen')`
        padding: 5px 0;
    `};
`;

const HeaderLine = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;

    padding: 0 18px;
    pointer-events: none;

    & > * {
        pointer-events: initial;
    }
`;

const Category = styled.div`
    flex-shrink: 0;

    height: 28px;
    padding: 0 12px;
    margin-right: 4px;
    border-radius: 6px;
    line-height: 26px;

    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
    background: #789821;
    cursor: default;
    overflow: hidden;
`;

const Title = styled.div`
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 0 18px;

    margin-bottom: 8px;
`;

const PostBody = styled(({ isPostPage, ...otherProps }) => <Link {...otherProps} />)`
    display: flex;
    align-items: center;

    margin-right: 18px;

    font-family: ${a => a.theme.fontFamily};
    color: #959595 !important;

    ${is('isPostPage')`
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `};
`;

const PostBodyWrapper = styled.div`
    display: flex;
    justify-content: space-between;

    padding: 0 18px;
`;

const Root = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 8px;

    min-height: 50px;

    background: #ffffff;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    ${isNot('commentopen')`
        justify-content: center;
    `};
`;

const Reply = styled.div`
    padding: 0 18px 0 60px;
`;

const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90px;
    opacity: 0;
    animation: fade-in 0.25s forwards;
    animation-delay: 0.25s;
`;

const CategoryTogglerWrapper = styled.div`
    display: flex;
`;

export class CommentCard extends Component {
    static propTypes = {
        permLink: PropTypes.string,
        grid: PropTypes.bool,
        isPostPage: PropTypes.bool,

        comment: PropTypes.instanceOf(Map),
        title: PropTypes.string.isRequired,
        fullParentURL: PropTypes.string.isRequired,
        extractedContent: PropTypes.shape({
            link: PropTypes.string,
            desc: PropTypes.string,
        }),
        isOwner: PropTypes.bool.isRequired,
        username: PropTypes.string,
    };

    state = {
        myVote: this.props.dataLoaded ? this.getMyVote(this.props) : null,
        showReply: false,
        edit: false,
        isCommentOpen: true,
    };

    commentRef = createRef();
    replyRef = createRef();

    componentWillReceiveProps(newProps) {
        if (this.props.comment !== newProps.comment && this.props.dataLoaded) {
            this.setState({
                myVote: this.getMyVote(newProps),
            });
        }
    }

    getMyVote(props) {
        const { username, comment } = props;

        let myVote = comment.get('active_votes').find(vote => vote.get('voter') === username, null);
        if (myVote) {
            myVote = myVote.toJS();
            myVote.weight = parseInt(myVote.weight || 0, 10);
        }
        return myVote;
    }

    renderHeaderForPost() {
        const { isCommentOpen } = this.state;
        const { comment, extractedContent, isPostPage } = this.props;

        return (
            <Header isCommentOpen={isCommentOpen}>
                <HeaderLine>
                    <CommentAuthor
                        author={comment.get('author')}
                        created={comment.get('created')}
                    />
                    {!isCommentOpen && (
                        <PostBody
                            to={extractedContent.link}
                            onClick={this.rememberScrollPosition}
                            dangerouslySetInnerHTML={{ __html: extractedContent.desc }}
                            isPostPage={isPostPage}
                        />
                    )}
                    <CloseOpenButton
                        isCommentOpen={isCommentOpen}
                        toggleComment={this.toggleComment}
                    />
                </HeaderLine>
            </Header>
        );
    }

    renderHeaderForProfile() {
        const { isCommentOpen } = this.state;
        const { fullParentURL, title, comment } = this.props;
        const detransliteratedCategory = detransliterate(comment.get('category'));

        return (
            <Header>
                <HeaderLine>
                    {isCommentOpen ? (
                        <CommentAuthor
                            author={comment.get('author')}
                            created={comment.get('created')}
                        />
                    ) : (
                        <ReLink
                            fullParentURL={fullParentURL}
                            title={title}
                            onClick={this.rememberScrollPosition}
                        />
                    )}
                    <CategoryTogglerWrapper>
                        <Category>{detransliteratedCategory}</Category>
                        <CloseOpenButton
                            isCommentOpen={isCommentOpen}
                            toggleComment={this.toggleComment}
                        />
                    </CategoryTogglerWrapper>
                </HeaderLine>
            </Header>
        );
    }

    renderTitle() {
        const { isOwner, fullParentURL, title } = this.props;
        const { edit } = this.state;

        return (
            <Title>
                <ReLink
                    fullParentURL={fullParentURL}
                    title={title}
                    onClick={this.rememberScrollPosition}
                />
                {isOwner && !edit && <EditButton onEditClick={this.onEditClick} />}
            </Title>
        );
    }

    renderBodyText() {
        const { edit } = this.state;
        const { extractedContent, comment, isOwner, isPostPage } = this.props;

        return (
            <Fragment>
                {edit ? (
                    <CommentFormLoader
                        reply
                        editMode
                        hideFooter
                        autoFocus
                        params={comment.toJS()}
                        forwardRef={this.commentRef}
                        onSuccess={this.onEditDone}
                        onCancel={this.onEditDone}
                    />
                ) : (
                    <PostBodyWrapper>
                        <PostBody
                            to={extractedContent.link}
                            onClick={this.rememberScrollPosition}
                            dangerouslySetInnerHTML={{ __html: extractedContent.desc }}
                        />
                        {isOwner && isPostPage && <EditButton onEditClick={this.onEditClick} />}
                    </PostBodyWrapper>
                )}
            </Fragment>
        );
    }

    renderReplyEditor() {
        const { comment } = this.props;

        return (
            <Reply>
                <CommentFormLoader
                    reply
                    hideFooter
                    autoFocus
                    params={comment.toJS()}
                    forwardRef={this.replyRef}
                    onSuccess={this.onReplySuccess}
                    onCancel={this.onReplyCancel}
                />
            </Reply>
        );
    }

    rememberScrollPosition = () => {
        this.props.onClick();
    };

    onReplySuccess = () => {
        this.setState({
            showReply: false,
        });

        this.props.onNotify(tt('g.reply_has_published'));
    };

    onReplyCancel = () => {
        this.setState({
            showReply: false,
        });
    };

    onEditClick = () => {
        this.setState({
            edit: true,
        });
    };

    onEditDone = () => {
        this.setState({
            edit: false,
        });
    };

    onReplyClick = () => {
        this.setState({
            showReply: true,
        });
    };

    toggleComment = () => {
        this.setState({
            isCommentOpen: !this.state.isCommentOpen,
        });
    };

    render() {
        console.log('render');
        const { showReply, isCommentOpen, edit, myVote } = this.state;
        const {
            dataLoaded,
            comment,
            username,
            extractedContent,
            isOwner,
            onVote,
            isPostPage,
            className,
        } = this.props;
        if (!dataLoaded) {
            return (
                <LoaderWrapper>
                    <LoadingIndicator type="circle" size={40} />
                </LoaderWrapper>
            );
        }
        return (
            <Root commentopen={isCommentOpen ? 1 : 0} className={className}>
                {isPostPage ? this.renderHeaderForPost() : this.renderHeaderForProfile()}
                {isCommentOpen ? (
                    <Fragment>
                        {!isPostPage && this.renderTitle()}
                        {this.renderBodyText()}
                        {showReply && this.renderReplyEditor()}
                        <CommentFooter
                            comment={comment}
                            contentLink={extractedContent.link}
                            isOwner={isOwner}
                            showReply={showReply}
                            edit={edit}
                            username={username}
                            onVote={onVote}
                            myVote={myVote}
                            replyRef={this.replyRef}
                            commentRef={this.commentRef}
                            onReplyClick={this.onReplyClick}
                        />
                    </Fragment>
                ) : null}
            </Root>
        );
    }
}
