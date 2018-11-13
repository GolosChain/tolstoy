import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import is from 'styled-is';
import by from 'styled-by';
import { Map } from 'immutable';

import CommentFormLoader from 'app/components/modules/CommentForm/loader';

const shadowScale = keyframes`
  0% {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  }
  50% {
    box-shadow: 0 2px 28px 0 rgba(0, 0, 0, 0.36);
  }
  100% {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  }
`;

const Wrapper = styled.div`
    margin-top: 20px;
    padding: 27px 20px ${by('padding-bottom')};
    background-color: white;
    border-radius: 8px;
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
        this.props.updateComments();
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
                <a id="comments" />
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
