import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const Badge = styled.div`
    position: absolute;
    top: -7px;
    right: -9px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    height: 20px;
    width: 20px;
    border: 2px solid #ffffff;
    background-color: #fc5d16;

    color: #ffffff;
    font-size: 10px;
    font-weight: bold;
    line-height: 12px;
    text-align: center;
`;

export default class IconBadge extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        width: PropTypes.number,
        height: PropTypes.number,
        size: PropTypes.number,
        count: PropTypes.number,
    };

    render() {
        const { count, ...props } = this.props;
        return (
            <Wrapper>
                <Icon {...props} />
                {Boolean(count) && <Badge>{count < 100 ? count : 99}</Badge>}
            </Wrapper>
        );
    }
}
