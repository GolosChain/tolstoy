import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import styled from 'styled-components';

import { fixDate } from 'src/app/helpers/time';

const Wrapper = styled.span`
    white-space: nowrap;
`;

export default class TimeAgoWrapper extends Component {
    render() {
        const { date, className } = this.props;

        const fixedDate = new Date(fixDate(date));

        return (
            <Wrapper className={className} data-tooltip={fixedDate.toLocaleString()}>
                <FormattedRelative {...this.props} value={fixedDate} />
            </Wrapper>
        );
    }
}
