import React, { PureComponent, Fragment, createRef } from 'react';
import styled from 'styled-components';

const Stub = styled.div`
    min-height: 650px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    width: 100%;
    position: sticky;
    top: 0;
    padding: 0 17px;
    background-color: #fff;
    box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.07);
    z-index: 5;

    @media (min-width: 577px) {
        display: none;
    }
`;

let PostForm = null;

export default class PostFormLoader extends PureComponent {
    mobileButtons = createRef();

    componentDidMount() {
        if (!PostForm) {
            require.ensure('./PostForm.connect', require => {
                PostForm = require('./PostForm.connect').default;

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
            return (
                <Fragment>
                    <ButtonWrapper innerRef={this.mobileButtons} />
                    <PostForm {...this.props} mobileButtonsWrapperRef={this.mobileButtons} />
                </Fragment>
            );
        }

        return <Stub />;
    }
}
