import React, { Component } from 'react';
import styled from 'styled-components';
import by from 'styled-by';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

import CommentFormLoader from 'app/components/modules/CommentForm/loader';

const CreateCommentWrapper = styled.div`
    margin-top: 20px;
    padding: 27px 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    padding-bottom: ${by('padding-bottom')};
`;

export default class CreateComment extends Component {
    static propTypes = {
        updateComments: PropTypes.func.isRequired,
        data: PropTypes.instanceOf(Map)

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

    onCancel = () => {
    };

    render() {
        const { data } = this.props;
        const { inputText } = this.state;

        return (
            <CreateCommentWrapper padding-bottom={inputText.length === 0 ? '17px' : '0'}>
                <a id="comments"></a>
                <CommentFormLoader
                    hideFooter={inputText.length === 0}
                    params={data.toJS()}
                    onChange={this.textChange}
                    onSuccess={this.onSuccess}
                    onCancel={this.onCancel}
                    clearAfterAction
                />
            </CreateCommentWrapper>
        );
    }
}
