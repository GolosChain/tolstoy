import React, { PureComponent, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';
import tt from 'counterpart';
import { detransliterate } from 'app/utils/ParsersAndFormatters';
import CommentFormLoader from 'app/components/modules/CommentForm/loader';
import Icon from 'golos-ui/Icon';
import VotePanel from '../VotePanel';
import { confirmVote } from 'src/app/helpers/votes';
import ReplyBlock from '../ReplyBlock';
import { AuthorBlock } from 'src/app/containers/post/activePanel/AuthorBlock';

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

const TitleIcon = Icon.extend`
    position: relative;
    height: 20px;
    min-width: 24px;
    margin-right: 6px;
    margin-bottom: -3px;
`;

const TitleLink = styled(Link)`
    color: #212121 !important;
    text-decoration: underline;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const PostBody = styled(Link)`
    display: block;
    padding: 0 18px;
    font-family: ${a => a.theme.fontFamily};
    color: #959595 !important;
`;

const Footer = styled.div`
    position: relative;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0 0 0;
    z-index: 1;
    pointer-events: none;

    & > * {
        pointer-events: initial;
    }

    @media (min-width: 890px) and (max-width: 1087px), (max-width: 639px) {
        flex-direction: column;
    }
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

const IconEditWrapper = styled.div`
    min-width: 30px;
    min-height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #aaa;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
        color: #333;
    }
`;

const ButtonStyled = styled.div`
    display: flex;
    align-items: center;
    margin-right: 18px;
    height: 100%;
    min-height: 50px;
    flex-grow: 1;
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    font-weight: bold;
    line-height: 18px;
    text-transform: uppercase;
    cursor: pointer;

    @media (min-width: 890px) and (max-width: 1200px), (max-width: 639px) {
        margin: 0;
        padding: 0 18px 0 11px;
    }
`;

const FooterConfirm = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
`;

const ButtonConfirm = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    color: #b7b7ba;
    cursor: pointer;

    ${is('main')`
        color: #2879ff !important;
    `};

    &:hover {
        color: #393636;
    }

    &:last-child {
        padding-right: 18px;
    }
`;

const Splitter = styled.div`
    width: 1px;
    height: 26px;
    margin: 0 6px;
    background: #e1e1e1;
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

const ReLinkWrapper = styled.div`
    padding-right: 10px;
    display: flex;
    align-items: center;
    line-height: 29px;
    font-family: ${a => a.theme.fontFamily};
    font-size: 20px;
    font-weight: bold;
    color: #212121;
    overflow: hidden;
`;

const CommentVotePanel = styled(VotePanel)`
    width: 257px;

    @media (min-width: 890px) and (max-width: 1087px), (max-width: 639px) {
        width: 100%;
        justify-content: space-between;
    }
`;

const CommentReplyBlock = styled(ReplyBlock)`
    margin: 0;

    @media (min-width: 890px) and (max-width: 1087px), (max-width: 639px) {
        flex-grow: 1;
        justify-content: center;
    }
`;

const CommentReplyWrapper = styled.div`
    display: flex;
    align-items: center;

    @media (min-width: 890px) and (max-width: 1087px), (max-width: 639px) {
        width: 100%;
        justify-content: center;
    }
`;

export class CommentCard extends PureComponent {
    static propTypes = {
        permLink: PropTypes.string,
        myAccountName: PropTypes.string,
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
        const { data, myAccountName } = props;
        const votes = data.get('active_votes');

        for (let vote of votes) {
            if (vote.get('voter') === myAccountName) {
                const v = vote.toJS();
                v.weight = parseInt(v.weight || 0, 10);
                return v;
            }
        }

        return null;
    }

    render() {
        const { showReply, isCommentOpen } = this.state;
        const { className } = this.props;

        return (
            <Root commentopen={isCommentOpen ? 1 : 0} className={className}>
                {this._renderHeader()}
                {isCommentOpen ? (
                    <Fragment>
                        {this._renderBodyRe()}
                        {this._renderBodyText()}
                        {showReply ? this._renderReplyEditor() : null}
                        {this._renderFooter()}
                    </Fragment>
                ) : null}
            </Root>
        );
    }

    _renderHeader() {
        const { isCommentOpen } = this.state;
        const { parentLink, title, dataToJS } = this.props;
        const author = dataToJS.author;
        const category = detransliterate(dataToJS.category);

        return (
            <Header>
                <HeaderLine>
                    {isCommentOpen ? (
                        <AuthorBlock author={author} dataToJS={dataToJS} />
                    ) : (
                        <ReLinkWrapper>
                            <TitleIcon name="comment" />
                            {tt('g.re2')}
                            :&nbsp;
                            <TitleLink to={parentLink} onClick={this._onTitleClick}>
                                {title}
                            </TitleLink>
                        </ReLinkWrapper>
                    )}
                    <Filler />
                    <Category>{category}</Category>
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

    _renderBodyRe() {
        const { myAccountName } = this.props;
        const { edit } = this.state;
        const { parentLink, title, dataToJS } = this.props;
        const showEditButton = myAccountName === dataToJS.author;

        return (
            <Title>
                <ReLinkWrapper>
                    <TitleIcon name="comment" />
                    {tt('g.re2')}
                    :&nbsp;
                    <TitleLink to={parentLink} onClick={this._onTitleClick}>
                        {title}
                    </TitleLink>
                </ReLinkWrapper>
                {showEditButton && !edit ? (
                    <IconEditWrapper
                        data-tooltip={'Редактировать комментарий'}
                        onClick={this._onEditClick}
                    >
                        <Icon name="pen" size={20} />
                    </IconEditWrapper>
                ) : null}
            </Title>
        );
    }

    _renderBodyText() {
        const { edit } = this.state;
        const { content, dataToJS, htmlContent } = this.props;

        return (
            <Fragment>
                {edit ? (
                    <CommentFormLoader
                        reply
                        editMode
                        hideFooter
                        autoFocus
                        params={dataToJS}
                        forwardRef={this._commentRef}
                        onSuccess={this._onEditDone}
                        onCancel={this._onEditDone}
                    />
                ) : (
                    <PostBody
                        to={content.link}
                        onClick={this._onClick}
                        dangerouslySetInnerHTML={htmlContent}
                    />
                )}
            </Fragment>
        );
    }

    _renderFooter() {
        const { data, myAccountName, allowInlineReply, content, dataToJS, isOwner } = this.props;
        const { showReply, edit } = this.state;
        if (showReply) {
            return (
                <FooterConfirm>
                    <ButtonConfirm onClick={this._onCancelReplyClick}>Отмена</ButtonConfirm>
                    <Splitter />
                    <ButtonConfirm main onClick={this._onPostReplyClick}>
                        Опубликовать
                    </ButtonConfirm>
                </FooterConfirm>
            );
        } else if (edit) {
            return (
                <FooterConfirm>
                    <ButtonConfirm onClick={this._onCancelEditClick}>Отмена</ButtonConfirm>
                    <Splitter />
                    <ButtonConfirm main onClick={this._onSaveEditClick}>
                        Сохранить
                    </ButtonConfirm>
                </FooterConfirm>
            );
        } else {
            return (
                <Footer>
                    <CommentVotePanel
                        data={data}
                        me={myAccountName}
                        onChange={this._onVoteChange}
                    />
                    <CommentReplyWrapper>
                        <CommentReplyBlock
                            count={data.get('children')}
                            link={content.link}
                            text="Комментарии"
                            showText={isOwner}
                        />
                        {allowInlineReply && dataToJS.author !== myAccountName ? (
                            <ButtonStyled light onClick={this._onReplyClick}>
                                Ответить
                            </ButtonStyled>
                        ) : null}
                    </CommentReplyWrapper>
                </Footer>
            );
        }
    }

    _renderReplyEditor() {
        const { dataToJS } = this.props;

        return (
            <Reply>
                <CommentFormLoader
                    reply
                    hideFooter
                    autoFocus
                    params={dataToJS}
                    forwardRef={this._replyRef}
                    onSuccess={this._onReplySuccess}
                    onCancel={this._onReplyCancel}
                />
            </Reply>
        );
    }

    _onTitleClick = e => {
        const { dataToJS } = this.props;
        if (this.props.onClick) {
            e.preventDefault();

            const url = e.currentTarget.href;

            if (dataToJS.parent_author) {
                this.props.onClick({
                    permLink: `${dataToJS.parent_author}/${dataToJS.parent_permlink}`,
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
        if (this.props.onClick) {
            e.preventDefault();
            this.props.onClick({
                permLink: this.props.permLink,
                url: this.props.content.link,
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

    _onEditClick = () => {
        this.setState({
            edit: true,
        });
    };

    _onEditDone = () => {
        this.setState({
            edit: false,
        });
    };

    _onVoteChange = async percent => {
        const { data, myAccountName } = this.props;
        const { myVote } = this.state;

        if (await confirmVote(myVote, percent)) {
            this.props.onVote(percent, {
                myAccountName: myAccountName,
                author: data.get('author'),
                permlink: data.get('permlink'),
            });
        }
    };

    _onReplyClick = () => {
        this.setState({
            showReply: true,
        });
    };

    _toggleComment = () => {
        this.setState({
            isCommentOpen: !this.state.isCommentOpen,
        });
    };

    _onSaveEditClick = () => {
        this._commentRef.current.post();
    };

    _onCancelEditClick = () => {
        this._commentRef.current.cancel();
    };

    _onPostReplyClick = () => {
        this._replyRef.current.post();
    };

    _onCancelReplyClick = () => {
        this._replyRef.current.cancel();
    };
}
