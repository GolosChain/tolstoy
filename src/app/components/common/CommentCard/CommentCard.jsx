import React, { PureComponent, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import { isNot } from 'styled-is';
import tt from 'counterpart';

import { detransliterate } from 'app/utils/ParsersAndFormatters';
import CommentFormLoader from 'app/components/modules/CommentForm/loader';

import Icon from 'golos-ui/Icon';
import CommentFooter from './CommentFooter';
import { CommentAuthor } from './CommentAuthor';
import { EditButton } from 'src/app/components/common/CommentCard/EditButton';
import { ReLink } from './ReLink';

const Header = styled.div`
    padding: 10px 0 6px;
    flex-shrink: 0;
`;

const HeaderLine = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    padding: 2px 18px;
    z-index: 1;
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

const PostBody = styled(Link)`
    display: block;
    padding: 0 18px;
    font-family: ${a => a.theme.fontFamily};
    color: #959595 !important;
`;

const Filler = styled.div`
    flex-grow: 1;
`;

const Root = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 8px;
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    ${isNot('commentopen')`
        justify-content: center;
        height: 50px;
    `};
`;

const Reply = styled.div`
    padding: 0 18px 0 60px;
`;

const ToggleCommentOpen = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 30px;
    min-height: 30px;
    margin-right: -4px;
    user-select: none;
    cursor: pointer;
    transform: rotate(0);
    transition: transform 0.4s;

    ${isNot('commentopen')`
        margin-top: -1px;
        color: #b7b7ba;
        transform: rotate(0.5turn);
    `};
`;

export class CommentCard extends PureComponent {
    static propTypes = {
        permLink: PropTypes.string,
        username: PropTypes.string,
        data: PropTypes.object,
        grid: PropTypes.bool,
        allowInlineReply: PropTypes.bool,
    };

    state = {
        myVote: this._getMyVote(this.props),
        showReply: false,
        edit: false,
        isCommentOpen: true,
    };

    _commentRef = createRef();
    _replyRef = createRef();

    componentWillReceiveProps(newProps) {
        if (this.props.data !== newProps.data) {
            this.setState({
                myVote: this._getMyVote(newProps),
            });
        }
    }

    _getMyVote(props) {
        const { username, activeVotes } = props;

        for (let vote of activeVotes) {
            if (vote.get('voter') === username) {
                const v = vote.toJS();
                v.weight = parseInt(v.weight || 0, 10);
                return v;
            }
        }

        return null;
    }

    render() {
        const { showReply, isCommentOpen, edit, myVote } = this.state;
        const {
            data,
            username,
            allowInlineReply,
            contentLink,
            isOwner,
            author,
            commentsCount,
            onVote,
            permLink,
            className,
        } = this.props;

        return (
            <Root commentopen={isCommentOpen ? 1 : 0} className={className}>
                {this._renderHeader()}
                {isCommentOpen ? (
                    <Fragment>
                        {this.titleBlock()}
                        {this._renderBodyText()}
                        {showReply ? this._renderReplyEditor() : null}
                        <CommentFooter
                            data={data}
                            allowInlineReply={allowInlineReply}
                            contentLink={contentLink}
                            isOwner={isOwner}
                            author={author}
                            commentsCount={commentsCount}
                            showReply={showReply}
                            edit={edit}
                            username={username}
                            onVote={onVote}
                            permLink={permLink}
                            myVote={myVote}
                            replyRef={this._replyRef}
                            commentRef={this._commentRef}
                            onReplyClick={this.onReplyClick}
                        />
                    </Fragment>
                ) : null}
            </Root>
        );
    }

    _renderHeader() {
        const { isCommentOpen } = this.state;
        const { fullParentURL, title, author, category, created } = this.props;
        const detransliteratedCategory = detransliterate(category);

        return (
            <Header>
                <HeaderLine>
                    {isCommentOpen ? (
                        <CommentAuthor author={author} created={created} />
                    ) : (
                        <ReLink
                            fullParentURL={fullParentURL}
                            title={title}
                            onTitleClick={this.onTitleClick}
                        />
                    )}
                    <Filler />
                    <Category>{detransliteratedCategory}</Category>
                    <ToggleCommentOpen
                        commentopen={isCommentOpen ? 1 : 0}
                        onClick={this._toggleComment}
                    >
                        <Icon name="chevron" width="12" height="7" />
                    </ToggleCommentOpen>
                </HeaderLine>
            </Header>
        );
    }

    titleBlock() {
        const { username, author, fullParentURL, title } = this.props;
        const { edit } = this.state;
        const showEditButton = username === author;

        return (
            <Title>
                <ReLink
                    fullParentURL={fullParentURL}
                    title={title}
                    onTitleClick={this.onTitleClick}
                />
                {showEditButton && !edit && <EditButton onEditClick={this.onEditClick} />}
            </Title>
        );
    }

    _renderBodyText() {
        const { edit } = this.state;
        const { contentLink, data, htmlContent } = this.props;

        return (
            <Fragment>
                {edit ? (
                    <CommentFormLoader
                        reply
                        editMode
                        hideFooter
                        autoFocus
                        params={data.toJS()}
                        forwardRef={this._commentRef}
                        onSuccess={this._onEditDone}
                        onCancel={this._onEditDone}
                    />
                ) : (
                    <PostBody
                        to={contentLink}
                        onClick={this._onClick}
                        dangerouslySetInnerHTML={htmlContent}
                    />
                )}
            </Fragment>
        );
    }

    _renderReplyEditor() {
        const { data } = this.props;

        return (
            <Reply>
                <CommentFormLoader
                    reply
                    hideFooter
                    autoFocus
                    params={data.toJS()}
                    forwardRef={this._replyRef}
                    onSuccess={this._onReplySuccess}
                    onCancel={this._onReplyCancel}
                />
            </Reply>
        );
    }

    onTitleClick = e => {
        const { parentAuthor, parentPermLink } = this.props;
        if (this.props.onClick) {
            e.preventDefault();

            const url = e.currentTarget.href;

            if (parentAuthor) {
                this.props.onClick({
                    permLink: `${parentAuthor}/${parentPermLink}`,
                    url,
                });
            } else {
                this.props.onClick({
                    permLink: this.props.permLink,
                    url,
                });
            }
        }
    };

    _onClick = e => {
        const { onClick, permLink, contentLink } = this.props;
        if (onClick) {
            e.preventDefault();
            onClick({
                permLink,
                url: contentLink,
            });
        }
    };

    _onReplySuccess = () => {
        this.setState({
            showReply: false,
        });

        this.props.onNotify('Ответ опубликован');
    };

    _onReplyCancel = () => {
        this.setState({
            showReply: false,
        });
    };

    onEditClick = () => {
        this.setState({
            edit: true,
        });
    };

    _onEditDone = () => {
        this.setState({
            edit: false,
        });
    };

    onReplyClick = () => {
        this.setState({
            showReply: true,
        });
    };

    _toggleComment = () => {
        this.setState({
            isCommentOpen: !this.state.isCommentOpen,
        });
    };
}
