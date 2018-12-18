import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const Root = styled.div`
    display: flex;
    align-items: center;
`;

const IconStyled = styled(Icon)`
    width: 22px;
`;

const Text = styled.span`
    margin-left: 7px;
    color: #959595;
`;

export default class ViewCount extends Component {
    componentDidMount() {
        const { viewCount, postLink } = this.props;

        if (viewCount == null) {
            this.props.fetchViewCount(postLink);
        }
    }

    render() {
        const { viewCount } = this.props;

        if (viewCount == null) {
            return null;
        }

        return (
            <Root data-tooltip={tt('view_count.views')}>
                <IconStyled name="eye" />
                <Text>{viewCount}</Text>
            </Root>
        );
    }
}
