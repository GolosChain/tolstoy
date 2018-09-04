import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Icon from '../../components/golos-ui/Icon/Icon';

const actionsData = [
    {
        iconName: 'like',
        count: 20,
    },
    {
        iconName: 'dislike',
        count: 18,
    },
    {
        iconName: 'repost-right',
        count: 20,
    },
    {
        iconName: 'sharing_triangle',
        count: null,
    },
    {
        iconName: 'star',
        count: null,
    },
];

const Wrapper = styled.div`
    width: 64px;
    min-height: 50px;
    padding: 15px 22px;
    border-radius: 32px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    & > div {
        padding: 10px 0;
    }
`;

const CountOf = styled.div`
    padding-top: 5px;
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    line-height: 23px;
`;

const ActionButton = styled.div`
    display: flex;
    align-items center;
    flex-direction: column;
    
    svg {
        padding: 5px;
        width: 34px;
        height: 34px;
        cursor: pointer;
        transition: transform 0.15s;
        
        &:hover {
            transform: scale(1.15);
        }
    }
`;

const ActionBlock = ({ iconName, count }) => {
    return (
        <ActionButton>
            <Icon name={iconName} />
            <CountOf>{count}</CountOf>
        </ActionButton>
    );
};

class SidePanel extends Component {
    static propTypes = {};

    static defaultProps = {};

    constructor() {
        super();
    }

    render() {
        const { className } = this.props;
        return (
            <Wrapper className={className}>
                {actionsData.map(action => {
                    return <ActionBlock iconName={action.iconName} count={action.count} />;
                })}
            </Wrapper>
        );
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
