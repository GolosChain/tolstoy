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

import Button from 'golos-ui/Button';
import { TagLink } from 'golos-ui/Tag';
import { EntryWrapper } from '../common';
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

    ${is('alertmode')`
        justify-content: unset;
    `};

    & > * {
        pointer-events: initial;
    }
`;

const Category = styled(TagLink)`
    margin-right: 4px;
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

    margin-right: 18px;
    overflow-x: hidden;

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
    `};
`;

const Root = styled(EntryWrapper)`
    position: relative;
    display: flex;
    flex-direction: column;

    min-height: 50px;

    ${is('renderCard')`
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    `};

    ${is('collapsed')`
        justify-content: center;
    `};

    ${is('gray')`
        opacity: 0.37;
        transition: opacity 0.25s;

        &:hover {
            opacity: 1;
        }
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

const TogglerWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const EmptyCloseOpenButton = styled.div`
    flex-shrink: 0;

    width: 30px;
    height: 30px;
`;

const SpamBlock = styled.div`
    display: flex;
    align-items: center;
    margin-right: 40px;
`;

const SpamText = styled.div`
    margin-right: 10px;
    font-size: 15px;
    color: #8a8a8a;
`;

export class CommentCard extends PureComponent {
    static propTypes = {
        permLink: PropTypes.string,
        isPostPage: PropTypes.bool,
        updateComments: PropTypes.func,

        comment: PropTypes.instanceOf(Map),
        stats: PropTypes.object,
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
    };

    static defaultProps = {
        updateComments: () => {},
    };

    state = {
        showReply: false,
        edit: false,
        collapsed: false,
        highlighted: false,
        showAlert: this.isNeedShowAlert(this.props),
    };

    commentRef = createRef();
    replyRef = createRef();
    commentTitleRef = createRef();

    componentWillReceiveProps(props) {
        const { anchorId } = this.props;
        const { highlighted } = this.state;

        if (window.location.hash.replace('#', '') === anchorId && !highlighted) {
            this.setState({ highlighted: true });
        }

        if (!this.props.state && props.state) {
            this.setState({
                showAlert: this.isNeedShowAlert(props),
            });
        }
    }

    isNeedShowAlert(props) {
        if (props.stats && !props.showSpam) {
            return props.stats.gray;
        }

        return false;
    }

    renderHeaderForPost() {
        const { comment, extractedContent, anchorId, isPostPage } = this.props;
        const { collapsed, highlighted, showAlert } = this.state;

        return (
            <Header collapsed={collapsed} id={anchorId} highlighted={highlighted}>
                <HeaderLine alertmode={showAlert}>
                    <CardAuthor author={comment.get('author')} created={comment.get('created')} />
                    {showAlert ? (
                        <SpamBlock>
                            <SpamText>{tt('comment_card.hidden')}</SpamText>
                            <Button light onClick={this.onShowClick}>
                                {tt('g.show')}
                            </Button>
                        </SpamBlock>
                    ) : (
                        <Fragment>
                            {collapsed ? (
                                <CommentBody
                                    to={extractedContent.link}
                                    onClick={this.rememberScrollPosition}
                                    dangerouslySetInnerHTML={{ __html: extractedContent.desc }}
                                    shortText
                                    isPostPage={isPostPage}
                                />
                            ) : null}
                            <EmptyCloseOpenButton />
                        </Fragment>
                    )}
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
                    <TogglerWrapper>
                        <Category to={'/trending/' + comment.get('category')} category={1}>
                            {detransliteratedCategory}
                        </Category>
                        <CloseOpenButton collapsed={collapsed} toggle={this.toggleComment} />
                    </TogglerWrapper>
                </HeaderLine>
            </Header>
        );
    }

    renderTitle() {
        const { isOwner, fullParentURL, title } = this.props;
        const { edit } = this.state;

        return (
            <Title innerRef={this.commentTitleRef}>
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
                        commentTitleRef={this.commentTitleRef.current}
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

    onShowClick = () => {
        this.setState({
            showAlert: false,
        });
    };

    render() {
        const {
            dataLoaded,
            comment,
            username,
            extractedContent,
            isOwner,
            onVote,
            isPostPage,
            className,
            stats,
            showSpam,
        } = this.props;

        const { showReply, collapsed, edit, highlighted, showAlert } = this.state;

        if (!showSpam && stats && stats.hide) {
            return null;
        }

        if (!dataLoaded) {
            return (
                <LoaderWrapper>
                    <LoadingIndicator type="circle" size={40} />
                </LoaderWrapper>
            );
        }

        return (
            <Root
                renderCard={!isPostPage}
                collapsed={collapsed}
                className={className}
                gray={stats && (stats.gray || stats.hide) && !isPostPage}
            >
                {isPostPage ? this.renderHeaderForPost() : this.renderHeaderForProfile()}
                {collapsed || showAlert ? null : (
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
                            replyRef={this.replyRef}
                            commentRef={this.commentRef}
                            onReplyClick={this.onReplyClick}
                            highlighted={highlighted}
                        />
                    </Fragment>
                )}
            </Root>
        );
    }
}
