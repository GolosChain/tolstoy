import React, { Component } from 'react';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon';

const PanelWrapper = styled.div`
    display: flex;
    flex: 1;
    align-items: center;

    box-shadow: 0 -2px 11px 0 rgba(0,0,0,0.1);
`;

const MediaAttachButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;

    width: 40px;
    height: 40px;
    margin: 15px;

    border-radius: 50%;
    box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.25);
    cursor: pointer;
`;

const EmojiButton = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;

    cursor: pointer;
`;

const SendButton = styled.button`
    margin: 0 34px;

    cursor: pointer;
`;

const TextAreaWrapper = styled.div`
    position: relative;
    display: flex;
    flex: 1;
`;

const RichTextArea = styled.textarea`
    display: flex;
    flex: 1;

    padding: 12px 35px 12px 20px;
    font-size: 14px;
    resize: none;
    outline: none;
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-all;
    box-sizing: border-box;
    border: 1px solid #E1E1E1;
    border-radius: 20px;

    ::placeholder {
        color: #b7b7ba;
    }
`;

RichTextArea.defaultProps = {
    placeholder: 'Напишите сообщение...'
}

export default class SendMessagePanel extends Component {

    render() {
        return (
            <PanelWrapper>
                <MediaAttachButton>
                    <Icon name="plus" width="15" height="15" />
                </MediaAttachButton>
                <TextAreaWrapper>
                    <RichTextArea />
                    <EmojiButton>
                        <Icon name="refresh" width="25" height="25" />
                    </EmojiButton>
                </TextAreaWrapper>
                <SendButton>
                    <Icon name="envelope" width="28" height="28" />
                </SendButton>
            </PanelWrapper>
        );
    }
}
