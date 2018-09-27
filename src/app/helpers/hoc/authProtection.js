import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import tt from 'counterpart';

const Root = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-size: 22px;
    color: #333;
    opacity: 0;
    animation: fade-in 0.5s forwards;
    animation-delay: 0.3s;
`;

export default (equalFunc = defaultEqualFunc) => Comp =>
    connect(state => ({ authorizedAccountName: state.user.getIn(['current', 'username']) }))(
        class NotAuthorized extends Component {
            render() {
                const { authorizedAccountName } = this.props;

                if (!authorizedAccountName) {
                    return <Root>{tt('auth_protection.need_auth')}</Root>;
                }

                if (equalFunc && !equalFunc(this.props, authorizedAccountName)) {
                    return <Root>{tt('auth_protection.not_allowed')}</Root>;
                }

                return <Comp {...this.props} />;
            }
        }
    );

function defaultEqualFunc(props, accountName) {
    try {
        return props.params.accountName.toLowerCase() === accountName;
    } catch (err) {
        return false;
    }
}
