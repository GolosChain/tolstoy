import React, { PureComponent } from 'react';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';
import Icon from 'app/components/elements/Icon';

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: row-reverse;
`;

const Root = styled.i`
    position: fixed;
    display: block;
    width: 40px;
    height: 40px;
    margin-top: 12px;
    border-radius: 50%;
    line-height: 38px;
    text-align: center;
    cursor: pointer;
    color: #000;
    transition: color 0.1s;
    background: #fff;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.2);
    z-index: 9;

    ${is('isPreview')`
        color: #fff !important;
        background: #2879ff;
    `};

    ${is('isStatic')`
        position: static;
    `};
     
     &:hover {
        color: #0078c4;
     }

    .PreviewButton__icon {
        width: 24px;
        height: 24px;

        & > svg {
            width: 24px;
            height: 24px;
        }
    }
`;

export default class PreviewButton extends PureComponent {
    render() {
        const { isPreview, isStatic } = this.props;
        const buttonText = isPreview ? tt('post_editor.edit_mode') : tt('post_editor.preview_mode');

        let icon = (
            <Root isStatic={isStatic} isPreview={isPreview} onClick={this._onPreviewClick}>
                <Icon
                    name="editor/eye"
                    className="PreviewButton__icon"
                    role="button"
                    data-tooltip={buttonText}
                    aria-label={buttonText}
                />
            </Root>
        );

        if (!isStatic) {
            icon = <Wrapper>{icon}</Wrapper>;
        }

        return icon;
    }

    _onPreviewClick = () => {
        this.props.onPreviewChange(!this.props.isPreview);
    };
}
