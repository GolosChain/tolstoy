import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router';
import styled from 'styled-components';
import { connect } from 'react-redux';
import tt from 'counterpart';
import extractContent from 'app/utils/ExtractContent';
import { immutableAccessor } from 'app/utils/Accessors';
import Userpic from 'app/components/elements/Userpic';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import { detransliterate } from 'app/utils/ParsersAndFormatters';
import CommentFormLoader from 'app/components/modules/CommentForm/loader';
import user from 'app/redux/User';
import transaction from 'app/redux/Transaction';
import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';
import VotePanel from '../VotePanel';
import { confirmVote } from 'src/app/helpers/votes';

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

const AuthorBlock = styled.div`
    display: flex;
    align-items: center;
`;
const Avatar = styled.a`
    display: block;
    width: 46px;
    height: 46px;
    margin-right: 10px;
    border-radius: 50%;
`;
const PostDesc = styled.div`
    padding-bottom: 2px;
    font-family: ${a => a.theme.fontFamily};
`;
const AuthorName = styled.a`
    display: block;
    font-size: 15px;
    font-weight: 500;
    color: #333;
    text-decoration: none;
`;
const PostDate = styled.div`
    font-size: 13px;
    color: #959595;
    cursor: default;
`;
const Category = styled.div`
    height: 28px;
    padding: 0 12px;
    margin-right: 4px;
    border-radius: 6px;
    line-height: 26px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
    background: #789821;
    cursor: default;
`;

const Body = styled.div`
    position: relative;
    padding: 0 18px 12px;
`;
const Title = styled.div`
    margin-bottom: 8px;
    line-height: 29px;
    font-family: ${a => a.theme.fontFamily};
    font-size: 20px;
    font-weight: bold;
    color: #212121;
`;
const TitleIcon = Icon.extend`
    position: relative;
    height: 20px;
    margin-right: 6px;
    margin-bottom: -3px;
`;
const TitleLink = styled(Link)`
    color: #212121 !important;
    text-decoration: underline;
`;

const PostBody = styled(Link)`
    display: block;
    font-family: ${a => a.theme.fontFamily};
    color: #959595 !important;
`;

const Footer = styled.div`
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    z-index: 1;
    pointer-events: none;

    & > * {
        pointer-events: initial;
    }

    @media (min-width: 890px) and (max-width: 1000px), (max-width: 420px) {
        flex-direction: column;

        & > div:first-child {
            width: 100%;
            justify-content: space-between;
        }
    }
`;

const Filler = styled.div`
    flex-grow: 1;
`;

const Root = styled.div`
    position: relative;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const Reply = styled.div`
    padding: 0 18px 18px 18px;
`;

const IconEdit = Icon.extend`
    position: absolute;
    top: 6px;
    right: 23px;
    color: #aaa;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
        color: #333;
    }
`;

const CommentButton = styled.div`
    display: flex;
    justify-content: space-between;
    height: 50px;
    padding: 0 18px;

    & div {
        display: flex;
        align-items: center;
    }

    @media (min-width: 890px) and (max-width: 1000px), (max-width: 420px) {
        width: 100%;
        padding: 0;

        & div {
            width: 50%;
        }
    }
`;

const CommentIconWrapper = styled.div`
    justify-content: flex-end;
    padding-right: 11px;
    cursor: pointer;
`;

const ReplyComment = styled.div`
    position: relative;
    padding-left: 7px;
    justify-content: flex-start;
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    font-weight: bold;
    line-height: 18px;
    text-transform: uppercase;
    cursor: pointer;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    transition: 0.2s;

    &:hover {
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    &::after {
        content: '';
        position: absolute;
        left: -1px;
        width: 1px;
        height: 26px;
        background-color: #e1e1e1;
    }
`;

const CountCommentsChildren = styled.span`
    padding-left: 5px;
    line-height: 18px;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: #959595;
`;

class CommentCard extends PureComponent {
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
    };

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
        const { data, className } = this.props;
        const { showReply } = this.state;

        this._data = data.toJS();
        this._content = extractContent(immutableAccessor, data);

        return (
            <Root className={cn(className)}>
                {this._renderHeader()}
                {this._renderBody()}
                {this._renderFooter()}
                {showReply ? this._renderReplyEditor() : null}
            </Root>
        );
    }

    _renderHeader() {
        const author = this._data.author;
        const category = detransliterate(this._data.category);

        return (
            <Header>
                <HeaderLine>
                    <AuthorBlock>
                        <Avatar href={`/@${author}`}>
                            <Userpic account={author} size={42} />
                        </Avatar>
                        <PostDesc>
                            <AuthorName href={`/@${author}`}>{author}</AuthorName>
                            <PostDate>
                                <TimeAgoWrapper date={this._data.created} />
                            </PostDate>
                        </PostDesc>
                    </AuthorBlock>
                    <Filler />
                    <Category>{category}</Category>
                </HeaderLine>
            </Header>
        );
    }

    _renderBody() {
        const { myAccountName } = this.props;
        const { edit } = this.state;

        let title = this._content.title;
        let parentLink = this._content.link;

        if (this._data.parent_author) {
            title = this._data.root_title;
            parentLink = `/${this._data.category}/@${this._data.parent_author}/${
                this._data.parent_permlink
            }`;
        }

        const showEditButton = myAccountName === this._data.author;

        return (
            <Body>
                <Title>
                    <TitleIcon name="comment" />
                    {tt('g.re2')}:{' '}
                    <TitleLink to={parentLink} onClick={this._onTitleClick}>
                        {title}
                    </TitleLink>
                    {showEditButton && !edit ? (
                        <IconEdit
                            name="pen"
                            size={20}
                            data-tooltip={'Редактировать комментарий'}
                            onClick={this._onEditClick}
                        />
                    ) : null}
                </Title>
                {edit ? (
                    <CommentFormLoader
                        reply
                        editMode
                        params={this._data}
                        onSuccess={this._onEditDone}
                        onCancel={this._onEditDone}
                    />
                ) : (
                    <PostBody
                        to={this._content.link}
                        onClick={this._onClick}
                        dangerouslySetInnerHTML={{ __html: this._content.desc }}
                    />
                )}
            </Body>
        );
    }

    _renderFooter() {
        const { data, myAccountName, allowInlineReply } = this.props;

        return (
            <Footer>
                <VotePanel data={data} me={myAccountName} onChange={this._onVoteChange} />
                {allowInlineReply && this._data.author !== myAccountName ? (
                    <Fragment>
                        <Filler />
                        <CommentButton>
                            <CommentIconWrapper>
                                <Icon name="comment" size={18} />
                                <CountCommentsChildren>
                                    {data.get('children')}
                                </CountCommentsChildren>
                            </CommentIconWrapper>
                            <ReplyComment onClick={this._onReplyClick}>Ответить</ReplyComment>
                        </CommentButton>
                    </Fragment>
                ) : null}
            </Footer>
        );
    }

    _renderReplyEditor() {
        const { data } = this.props;

        return (
            <Reply>
                <CommentFormLoader
                    reply
                    params={data.toJS()}
                    onSuccess={this._onReplySuccess}
                    onCancel={this._onReplyCancel}
                />
            </Reply>
        );
    }

    _onTitleClick = e => {
        if (this.props.onClick) {
            e.preventDefault();

            const url = e.currentTarget.href;

            if (this._data.parent_author) {
                this.props.onClick({
                    permLink: `${this._data.parent_author}/${this._data.parent_permlink}`,
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
                url: this._content.link,
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
        const props = this.props;
        const { myVote } = this.state;

        if (await confirmVote(myVote, percent)) {
            this.props.onVote(percent, {
                myAccountName: props.myAccountName,
                author: props.data.get('author'),
                permlink: props.data.get('permlink'),
            });
        }
    };

    _onReplyClick = () => {
        this.setState({
            showReply: true,
        });
    };
}

export default connect(
    (state, props) => {
        return {
            myAccountName: state.user.getIn(['current', 'username']),
            data: state.global.getIn(['content', props.permLink]),
        };
    },
    dispatch => ({
        onVote: (percent, { myAccountName, author, permlink }) => {
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'vote',
                    operation: {
                        voter: myAccountName,
                        author,
                        permlink,
                        weight: percent * 10000,
                        __config: {
                            title: percent < 0 ? tt('voting_jsx.confirm_flag') : null,
                        },
                    },
                    successCallback: () => dispatch(user.actions.getAccount()),
                })
            );
        },
        onNotify: text => {
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                    message: text,
                    dismissAfter: 5000,
                },
            });
        },
    })
)(CommentCard);
