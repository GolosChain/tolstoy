import React, { PureComponent, Fragment, createRef } from 'react';
import styled from 'styled-components';
import is from 'styled-is';

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

    @media (min-width: 769px) {
        top: 60px;
    }

    @media (min-width: 861px) {
        display: none;
    }

    @media (max-width: 576px) {
        ${is('isEdit')`
            padding: 0 20px;
        `};
    }

    ${is('isEdit')`
        box-shadow: none;
        padding: 0 70px;
    `};
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
        const { editMode } = this.props;
        if (PostForm) {
            return (
                <Fragment>
                    <ButtonWrapper ref={this.mobileButtons} isEdit={editMode} />
                    <PostForm {...this.props} mobileButtonsWrapperRef={this.mobileButtons} />
                </Fragment>
            );
        }

        return <Stub />;
    }
}
