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

const Plus = styled.span`
    margin: 0 4px;
`;

@injectIntl
export default class PayoutInfo extends PureComponent {
    componentWillReceiveProps(newProps) {
        if (
            newProps.needLoadRatesForDate &&
            this.props.needLoadRatesForDate !== newProps.needLoadRatesForDate
        ) {
            this.props.getHistoricalData(newProps.needLoadRatesForDate);
        }
    }

    render() {
        const {
            data,
            intl,
            isPending,
            total,
            totalGbg,
            overallTotal,
            author,
            authorGbg,
            curator,
            benefactor,
        } = this.props;

        const lastPayout = data.get('last_payout');
        const amount = renderValue(overallTotal, 'GOLOS', null, lastPayout);
        const amountGolos = `${total.toFixed(3)} GOLOS`;
        const amountGbg = totalGbg ? `${totalGbg.toFixed(3)} GBG` : null;
        const duration = capitalize(intl.formatRelative(data.get('cashout_time')));

        console.log(this.props);

        return (
            <Root>
                <Part>
                    <Title>
                        {isPending ? tt('payout_info.potential_payout') : tt('payout_info.payout')}
                    </Title>
                    <Payout>
                        {amount.split(' ')[1] === 'GOLOS' && !amountGbg ? (
                            <Money>{amount}</Money>
                        ) : (
                            <Fragment>
                                <Money>{amountGolos}</Money>
                                {amountGbg ? (
                                    <Fragment>
                                        {' + '}
                                        <Money>{amountGbg}</Money>{' '}
                                    </Fragment>
                                ) : null}
                                {' ('}
                                <MoneyConvert>{amount}</MoneyConvert>
                                {')'}
                            </Fragment>
                        )}
                    </Payout>
                    {isPending ? <Duration>{duration}</Duration> : null}
                </Part>
                <Part>
                    <Line>
                        <Label>{tt('payout_info.author')}</Label>
                        <Money>{author.toFixed(1)} GOLOS</Money>
                        {authorGbg ? (
                            <Fragment>
                                <Plus>+</Plus>
                                <Money>{authorGbg.toFixed(1)} GBG</Money>
                            </Fragment>
                        ) : null}
                    </Line>
                    <Line>
                        <Label>{tt('payout_info.curator')}</Label>
                        <Money>{curator.toFixed(1)} GOLOS</Money>
                    </Line>
                    <Line>
                        <Label>{tt('payout_info.beneficiary')}</Label>
                        <Money>{benefactor.toFixed(1)} GOLOS</Money>
                    </Line>
                </Part>
            </Root>
        );
    }
}
