import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import is from 'styled-is';
import by from 'styled-by';
import { Map } from 'immutable';

import CommentFormLoader from 'app/components/modules/CommentForm/loader';

import { smoothScroll } from 'src/app/helpers/window';

const shadowScale = keyframes`
  0% {
    box-shadow: 0 0 10px 0 rgba(200, 225, 255, 0.06);
    border-color: rgba(33, 136, 255, 0.06);
  }
  50% {
    box-shadow: 0 0 10px 0 rgba(200, 225, 255, 1);
    border-color: rgba(33, 136, 255, 1);
  }
  100% {
    box-shadow: 0 0 10px 0 rgba(200, 225, 255, 0.06);
    border-color: rgba(33, 136, 255, 0.06);
  }
`;

const Wrapper = styled.div`
    margin-top: 20px;
    padding: 27px 20px ${by('padding-bottom')};
    background-color: white;
    border-radius: 8px;
    border: 1px solid transparent;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    ${is('commentInputFocused')`
        animation: ${shadowScale} 1.5s linear 0.8s;
    `};
`;

export default class CreateComment extends Component {
    static propTypes = {
        updateComments: PropTypes.func.isRequired,
        data: PropTypes.instanceOf(Map),
        commentInputFocused: PropTypes.bool,
    };

    state = {
        inputText: '',
    };

    textChange = value => {
        this.setState({
            inputText: value.trim(),
        });
    };

    onSuccess = () => {
        const { commentContainerRef } = this.props;
        this.props.updateComments();
        if (commentContainerRef && commentContainerRef.current) {
            const commentContainerBottom = commentContainerRef.current.getBoundingClientRect()
                .bottom;
            smoothScroll(commentContainerBottom + pageYOffset, 1000);
        }
    };

    onCancel = () => {};

    render() {
        const { data, commentInputFocused } = this.props;
        const { inputText } = this.state;

        return (
            <Wrapper
                padding-bottom={inputText.length === 0 ? '17px' : '0'}
                commentInputFocused={commentInputFocused}
            >
                <a id="createComment" />
                <CommentFormLoader
                    hideFooter={inputText.length === 0}
                    params={data.toJS()}
                    onChange={this.textChange}
                    onSuccess={this.onSuccess}
                    onCancel={this.onCancel}
                    clearAfterAction
                />
            </Wrapper>
        );
    }
}
