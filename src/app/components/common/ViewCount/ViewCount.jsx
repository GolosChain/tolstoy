import React, { Component } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const INVALIDATION_INTERVAL = 60 * 1000;

const Text = styled.div`
    margin: 0 -1px 0 10px;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    font-size: 18px;
    letter-spacing: 1.6px;
    color: #757575;
    user-select: none;
    cursor: default;

    ${is('mini')`
        font-size: 16px;
        letter-spacing: 1.4px;
        
        ${Text} {
            margin-right: 7px;
        }
    `}
`;

const EyeIcon = styled(Icon).attrs({ name: 'eye' })`
    width: 20px;
    color: #333;
`;

export default class ViewCount extends Component {
    componentDidMount() {
        const { viewCount, postLink, timestamp } = this.props;

        if (
            viewCount === null ||
            viewCount === undefined ||
            (timestamp && timestamp + INVALIDATION_INTERVAL > Date.now())
        ) {
            this.props.fetchViewCount(postLink);
        }
    }

    render() {
        const { viewCount, mini, className } = this.props;

        if (viewCount === null || viewCount === undefined) {
            return null;
        }

        const hint = tt('view_count.view_count');

        return (
            <Wrapper data-tooltip={hint} aria-label={hint} mini={mini} className={className}>
                <EyeIcon />
                <Text>{viewCount}</Text>
            </Wrapper>
        );
    }
}
