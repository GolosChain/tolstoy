import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
    width: 64px;
    min-height: 50px;
    border-radius: 32px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5), 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

class SidePanel extends Component {
    static propTypes = {};

    static defaultProps = {};

    constructor() {
        super();
    }

    render() {
        const { className } = this.props;
        return <Wrapper className={className}>Side Panel</Wrapper>;
    }
}

const mapStateToProps = (state, props) => {
    return {};
};

const mapDispatchToProps = (dispatch, props) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SidePanel);
