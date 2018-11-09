import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import styled from 'styled-components';

const Wrapper = styled.span`
    white-space: nowrap;
`;

export default class TimeAgoWrapper extends Component {
    render() {
        let { date, className } = this.props;

        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(date)) {
            date += 'Z';
        }

        return (
            <Wrapper className={className} data-tooltip={new Date(date).toLocaleString()}>
                <FormattedRelative {...this.props} value={date} />
            </Wrapper>
        );
    }
}
