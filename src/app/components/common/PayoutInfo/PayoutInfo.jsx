import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import tt from 'counterpart';
import capitalize from 'lodash/capitalize';

import { renderValue } from 'src/app/helpers/currency';

const Root = styled.div`
    border-radius: 8px;
    color: #393636;
    background: #fff;
`;

const Part = styled.div`
    padding: 12px 24px;
    border-bottom: 1px solid #e1e1e1;

    &:first-child {
        padding-top: 12px;
    }

    &:last-child {
        padding-bottom: 12px;
        border: none;
    }
`;

const Title = styled.div`
    margin: 10px 0;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
`;

const Payout = styled.div`
    margin-bottom: 4px;
    text-align: center;
    font-size: 18px;
`;

const Duration = styled.div`
    margin: -2px 0 6px;
    text-align: center;
    font-size: 12px;
    color: #959595;
`;

const Line = styled.div`
    display: flex;
    align-items: center;
    height: 38px;
`;

const Label = styled.div`
    flex-grow: 1;
    margin-right: 38px;
    line-height: 1.2em;
    color: #959595;
`;

const Money = styled.span`
    white-space: nowrap;
    font-weight: bold;
`;

const MoneyConvert = styled.span``;

@injectIntl
export default class PayoutInfo extends PureComponent {
    render() {
        const { data, intl, isPending, total, author, curator, benefactor } = this.props;

        const lastPayout = data.get('last_payout');
        const amount = renderValue(total, 'GBG', null, lastPayout);
        const amountNative = renderValue(total, 'GBG', null, lastPayout, 'GOLOS');
        const duration = capitalize(intl.formatRelative(data.get('cashout_time')));

        return (
            <Root>
                <Part>
                    <Title>
                        {isPending ? tt('payout_info.potential_payout') : tt('payout_info.payout')}
                    </Title>
                    <Payout>
                        {amount === amountNative ? (
                            <Money>{amount}</Money>
                        ) : (
                            <Fragment>
                                <Money>{amountNative}</Money> (<MoneyConvert>{amount}</MoneyConvert>
                                )
                            </Fragment>
                        )}
                    </Payout>
                    {isPending ? <Duration>{duration}</Duration> : null}
                </Part>
                <Part>
                    <Line>
                        <Label>{tt('payout_info.author')}</Label>
                        <Money>{renderValue(author, 'GBG', 1, lastPayout, 'GOLOS')}</Money>
                    </Line>
                    <Line>
                        <Label>{tt('payout_info.curator')}</Label>
                        <Money>{renderValue(curator, 'GBG', 1, lastPayout, 'GOLOS')}</Money>
                    </Line>
                    <Line>
                        <Label>{tt('payout_info.beneficiary')}</Label>
                        <Money>{renderValue(benefactor, 'GBG', 1, lastPayout, 'GOLOS')}</Money>
                    </Line>
                </Part>
            </Root>
        );
    }
}
