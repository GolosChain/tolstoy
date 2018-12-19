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
    transition: color 0.1s, opacity 0.15s;
    background: #fff;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.2);
    z-index: 9;
    transform: translateX(50px);

    ${is('isInvisible')`
        visibility: hidden;
        opacity: 0;
    `};

    ${is('isPreview')`
        color: #fff !important;
        background: #2879ff;
    `};

    ${is('isStatic')`
        position: static;
        transform: translateX(0);
        margin-top: 0;
    `};

    ${is('isMobile')`
        display: block;
    `};

    ${is('isDesktop')`
        display: block;
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

    @media (min-width: 821px) {
        ${is('isMobile')`
            display: none;
        `};
    }

    @media (max-width: 820px) {
        ${is('isDesktop')`
            display: none;
        `};
    }
`;

export default class PreviewButton extends PureComponent {
    previewButton = React.createRef();

    render() {
        const { isPreview, isStatic, isVisible, isMobile, isDesktop } = this.props;
        const buttonText = isPreview ? tt('post_editor.edit_mode') : tt('post_editor.preview_mode');

        let icon = (
            <Root
                innerRef={this.previewButton}
                isStatic={isStatic}
                isPreview={isPreview}
                isInvisible={!isVisible && !isStatic}
                isMobile={isMobile}
                isDesktop={isDesktop}
                onClick={this._onPreviewClick}
            >
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

    getPreviewButtonPosition = () => {
        const { current } = this.previewButton;

        const previewButtonYTop = current ? current.getBoundingClientRect().top : null;
        return previewButtonYTop;
    };
}
