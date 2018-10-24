import React, { PureComponent, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Map } from 'immutable';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { detransliterate } from 'app/utils/ParsersAndFormatters';
import CommentFormLoader from 'app/components/modules/CommentForm/loader';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

import CloseOpenButton from '../CloseOpenButton';
import CommentFooter from '../CommentFooter';
import CardAuthor from '../CardAuthor';
import EditButton from '../EditButton';
import ReLink from '../ReLink';
import MarkdownViewer from 'app/components/cards/MarkdownViewer';

const Header = styled.div`
    padding: 12px 0 8px 0;
    flex-shrink: 0;

    ${is('collapsed')`
        padding: 5px 0;
    `};
    
    ${is('highlighted')`
        background-color: #e7eef9; 
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

const CommentBody = styled(
    ({ shortText, isPostPage, to, ...otherProps }) =>
        isPostPage ? <div {...otherProps} /> : <Link to={to} {...otherProps} />
)`
    display: block;
    width: 100%;

    margin-right: 18px;

    font-family: ${a => a.theme.fontFamily};
    color: #959595 !important;

    ${is('shortText')`
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `};
`;

const CommentBodyWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0 18px;
    
    ${is('highlighted')`
        background-color: #e7eef9;
    `}
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

    ${is('collapsed')`
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
    align-items: center;
`;

const EmptyCloseOpenButton = styled.div`
    flex-shrink: 0;

    width: 30px;
    height: 30px;
`;

export class CommentCard extends PureComponent {
    static propTypes = {
        permLink: PropTypes.string,
        grid: PropTypes.bool,
        isPostPage: PropTypes.bool,
        updateComments: PropTypes.func,

        comment: PropTypes.instanceOf(Map),
        title: PropTypes.string.isRequired,
        fullParentURL: PropTypes.string.isRequired,
        extractedContent: PropTypes.shape({
            link: PropTypes.string,
            desc: PropTypes.string,
            body: PropTypes.string,
        }),
        isOwner: PropTypes.bool.isRequired,
        username: PropTypes.string,
        payout: PropTypes.number,
        showVotedUsersList: PropTypes.func.isRequired,
    };

    static defaultProps = {
        updateComments: () => {},
    };

    state = {
        myVote: this.props.dataLoaded ? this.getMyVote(this.props) : null,
        showReply: false,
        edit: false,
        collapsed: false,
        highlighted: false,
    };

    commentRef = createRef();
    replyRef = createRef();

    componentWillReceiveProps(newProps) {
        const { anchorId, comment, dataLoaded } = this.props;
        const { highlighted } = this.state;
        if (window.location.hash.replace('#', '') === anchorId && !highlighted) {
            this.setState({ highlighted: true });
        }
        if (comment !== newProps.comment && dataLoaded) {
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
        const { comment, extractedContent, anchorId } = this.props;
        const { collapsed, highlighted } = this.state;

        return (
            <Header collapsed={collapsed} id={anchorId} highlighted={highlighted}>
                <HeaderLine>
                    <CardAuthor author={comment.get('author')} created={comment.get('created')} />
                    {collapsed && (
                        <CommentBody
                            to={extractedContent.link}
                            onClick={this.rememberScrollPosition}
                            dangerouslySetInnerHTML={{ __html: extractedContent.desc }}
                            shortText
                            isPostPage={isPostPage}
                        />
                    )}
                    <EmptyCloseOpenButton />
                </HeaderLine>
            </Header>
        );
    }

    renderHeaderForProfile() {
        const { fullParentURL, title, comment, anchorId } = this.props;
        const { collapsed, highlighted } = this.state;
        const detransliteratedCategory = detransliterate(comment.get('category'));

        return (
            <Header collapsed={collapsed} id={anchorId} highlighted={highlighted}>
                <HeaderLine>
                    {collapsed ? (
                        <ReLink
                            fullParentURL={fullParentURL}
                            title={title}
                            onClick={this.rememberScrollPosition}
                        />
                    ) : (
                        <CardAuthor
                            author={comment.get('author')}
                            created={comment.get('created')}
                        />
                    )}
                    <CategoryTogglerWrapper>
                        <Category>{detransliteratedCategory}</Category>
                        <CloseOpenButton collapsed={collapsed} toggleComment={this.toggleComment} />
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
        const { extractedContent, comment, isOwner, isPostPage, payout } = this.props;
        const { edit, highlighted } = this.state;

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
                    <CommentBodyWrapper highlighted={highlighted}>
                        <CommentBody
                            to={extractedContent.link}
                            onClick={this.rememberScrollPosition}
                            isPostPage={isPostPage}
                        >
                            <MarkdownViewer
                                text={extractedContent.body}
                                jsonMetadata={comment.get('json_metadata')}
                                highQualityPost={payout > 10}
                                noImage={!comment.getIn(['stats', 'pictures'])}
                                timeCteated={new Date(comment.get('created'))}
                            />
                        </CommentBody>
                        {isOwner && isPostPage && <EditButton onEditClick={this.onEditClick} />}
                    </CommentBodyWrapper>
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
        this.props.updateComments();
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
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        const { showReply, collapsed, edit, myVote, highlighted } = this.state;

        const {
            dataLoaded,
            comment,
            username,
            extractedContent,
            isOwner,
            onVote,
            isPostPage,
            showVotedUsersList,
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
            <Root collapsed={collapsed} className={className}>
                {isPostPage ? this.renderHeaderForPost() : this.renderHeaderForProfile()}
                {collapsed ? null : (
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
                            showVotedUsersList={showVotedUsersList}
                            highlighted={highlighted}
                        />
                    </Fragment>
                )}
            </Root>
        );
    }
}
