import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const Badge = styled.div`
    position: absolute;
    top: -7px;
    left: 9px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 2px 4px 1px 4px;

    border-radius: 50%;
    min-width: 20px;
    border: 2px solid #ffffff;
    background-color: #fc5d16;

    color: #ffffff;
    font-size: 10px;
    font-weight: bold;
    line-height: 12px;
    text-align: center;

    ${is('gtTen')`
        border-radius: 8px;
    `};
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
        const gtTen = count > 9;
        const gtThousand = count > 999;

        return (
            <Wrapper>
                <Icon {...props} />
                {Boolean(count) && (
                    <Badge gtTen={gtTen}>
                        {gtThousand ? '999+' : count}
                    </Badge>
                )}
            </Wrapper>
        );
    }
}
