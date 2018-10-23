import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import DialogManager from 'app/components/elements/common/DialogManager';
import { PostTitle, PostBody } from 'src/app/components/cards/common';
import CardAuthor from 'src/app/components/cards/CardAuthor';
import DialogButton from 'src/app/components/common/DialogButton';

const PADDING = 24;

const Root = styled.div`
    position: relative;
    flex-basis: 800px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const CloseIcon = styled(Icon)`
    position: absolute;
    top: 16px;
    right: 16px;
    width: 30px;
    height: 30px;
    padding: 8px;
    color: #e1e1e1;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
        color: #999;
    }
`;

const Header = styled.div`
    padding: 0 ${PADDING}px;
    margin: 18px 0;
    font-size: 20px;
    font-weight: 600;
    user-select: none;
`;

const InputWrapper = styled.div`
    position: relative;
    margin: 0 ${PADDING}px;
`;

const Input = styled.div`
    position: relative;
    display: block;
    width: 100%;
    max-height: 200px;
    line-height: 24px;
    padding: 11px 16px 9px;
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    overflow: hidden;
    overflow-y: auto;
    background: transparent;

    &:focus {
        outline: none;
        box-shadow: 0 0 6px #4d90fe;
    }
`;

const Placeholder = styled.div`
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    padding: 11px 0 0 16px;
    line-height: 24px;
    color: #bababa;
    user-select: none;
    pointer-events: none;
`;

const PostPreview = styled.div`
    padding: 0 ${PADDING}px;
    margin: 20px 0 18px;
`;

const CardAuthorStyled = styled(CardAuthor)`
    margin-bottom: 12px;
`;

const Footer = styled.div`
    display: flex;
    height: 50px;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 -2px 14px 0 rgba(0, 0, 0, 0.07);
    overflow: hidden;
`;

export default class RepostDialog extends Component {
    static propTypes = {
        myAccountName: PropTypes.string.isRequired,
        postLink: PropTypes.string.isRequired,
        sanitizedPost: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
    };

    state = {
        text: '',
    };

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    onClose = () => {
        this.props.onClose();
    };

    confirmClose = () => {
        return !this.state.text.trim();
    };

    onTextChange = e => {
        this.setState({
            text: e.currentTarget.innerText,
        });
    };

    onCancelClick = () => {
        this.props.onClose();
    };

    onOkClick = () => {
        const { myAccountName, postLink } = this.props;
        const { text } = this.state;

        const trimmedText = text.trim();

        const [author, permLink] = postLink.split('/');

        this.props.repost({
            myAccountName,
            author,
            permLink,
            comment: trimmedText,
            onSuccess: this.onSuccess,
            onError: this.onError,
        });
    };

    onSuccess = () => {
        this.props.showNotification(tt('repost_dialog.success'));
        this.props.onClose();
    };

    onError = err => {
        DialogManager.alert(`${tt('g.error')}:\n${err}`);
    };

    render() {
        const { sanitizedPost } = this.props;
        const { text } = this.state;

        return (
            <Root>
                <CloseIcon name="cross_thin" onClick={this.onClose} />
                <Header>{tt('repost_dialog.title')}</Header>
                <InputWrapper>
                    {text && text !== '\n' ? null : (
                        <Placeholder>{tt('repost_dialog.placeholder')}</Placeholder>
                    )}
                    <Input
                        tabIndex="0"
                        contentEditable="true"
                        role="textbox"
                        aria-multiline="true"
                        autoComplete="off"
                        value={text}
                        autoFocus
                        onInput={this.onTextChange}
                    />
                </InputWrapper>
                <PostPreview>
                    <CardAuthorStyled
                        author={sanitizedPost.author}
                        created={sanitizedPost.created}
                        noLinks
                    />
                    <PostTitle>{sanitizedPost.title}</PostTitle>
                    <PostBody dangerouslySetInnerHTML={sanitizedPost.html} />
                </PostPreview>
                <Footer>
                    <DialogButton text={tt('g.cancel')} onClick={this.onCancelClick} />
                    <DialogButton text={tt('repost_dialog.ok')} primary onClick={this.onOkClick} />
                </Footer>
            </Root>
        );
    }
}
