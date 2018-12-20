import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon/index';

import DotsMenu from 'src/app/components/userProfile/common/UserHeader/DotsMenu/DotsMenu';

const Dots = styled.button`
    display: flex;
    padding: 5px;
    margin: 0 0 -5px 5px;
    cursor: pointer;
    color: #ffffff;
    outline: none;

    &:hover {
        color: #2879ff;
    }
`;

export default class DotsButton extends Component {
    state = {
        menuOpen: false,
    };

    toggleMenu = () => {
        const { menuOpen } = this.state;
        this.setState({ menuOpen: !menuOpen });
    };

    render() {
        const { menuOpen } = this.state;
        return (
            <Fragment>
                {menuOpen && <DotsMenu />}
                <Dots onClick={this.toggleMenu}>
                    <Icon name="dots" width="3" height="15" />
                </Dots>
            </Fragment>
        );
    }
}
