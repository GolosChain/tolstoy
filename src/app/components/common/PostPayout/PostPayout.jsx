import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';

import CurrencyValue from 'src/app/components/common/CurrencyValue';

const CurrencyValueStyled = styled(CurrencyValue)`
    ${is('limited')`
        opacity: 0.33;
    `} ${is('declined')`
        text-decoration: line-through;
    `};
`;

export default class PostPayout extends PureComponent {
    render() {
        const { data, limitedOverallTotal, isLimit, isDeclined, className } = this.props;

        return (
            <CurrencyValueStyled
                limited={isLimit ? 1 : 0}
                declined={isDeclined ? 1 : 0}
                value={limitedOverallTotal}
                currency="GOLOS"
                date={data.get('last_payout')}
                className={className}
            />
        );
    }
}
