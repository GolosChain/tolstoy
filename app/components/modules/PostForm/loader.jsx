import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Stub = styled.div`
    min-height: 650px;
`;

let PostForm = null;

export default class PostFormLoader extends PureComponent {
    componentDidMount() {
        if (!PostForm) {
            require.ensure('./PostForm', require => {
                PostForm = require('./PostForm').default;

                if (!this._unmount) {
                    this.forceUpdate();
                }
            });
        }
    }

    componentWillUnmount() {
        this._unmount = true;
    }

    render() {
        if (PostForm) {
            return <PostForm {...this.props} />;
        }

        return <Stub />;
    }
}
