import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { renderValue } from 'src/app/helpers/currency';
import HintIcon from 'app/components/elements/common/HintIcon/HintIcon';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';

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
    margin-right: 24px;
`;

const MoneyConvert = styled.span``;

const Plus = styled.span`
    margin: 0 4px;
`;

export default class PayoutInfo extends PureComponent {
    componentWillReceiveProps(newProps) {
        const { needLoadRatesForDate } = this.props;
        const needNew = newProps.needLoadRatesForDate;

        if (needNew && needLoadRatesForDate !== needNew) {
            this.props.getHistoricalData(needNew);
        }
    }

    renderOverallValue() {
        const { total, totalGbg, overallTotal, lastPayout } = this.props;

        const amount = renderValue(overallTotal, 'GOLOS', { date: lastPayout });
        const amountGolos = `${total.toFixed(3)} GOLOS`;
        const amountGbg = totalGbg ? `${totalGbg.toFixed(3)} GBG` : null;

        const showOneCurrency = !amountGbg && amount.split(' ')[1] === 'GOLOS';

        if (showOneCurrency) {
            return <Money>{amount}</Money>;
        }

        let gbgSection = null;

        if (amountGbg) {
            gbgSection = (
                <Fragment>
                    {' + '}
                    <Money>{amountGbg}</Money>{' '}
                </Fragment>
            );
        }

        return (
            <Fragment>
                <Money>{amountGolos}</Money>
                {gbgSection} (<MoneyConvert>{amount}</MoneyConvert>)
            </Fragment>
        );
    }

    render() {
        const { isPending, author, authorGbg, curator, benefactor, cashoutTime } = this.props;

        return (
            <Root>
                <Part>
                    <Title>
                        {isPending ? tt('payout_info.potential_payout') : tt('payout_info.payout')}
                    </Title>
                    <Payout>{this.renderOverallValue()}</Payout>
                    {isPending ? (
                        <Duration>
                            <TimeAgoWrapper date={cashoutTime} />
                        </Duration>
                    ) : null}
                </Part>
                <Part>
                    <Line>
                        <Label>{tt('payout_info.author')}</Label>
                        <Money>{author.toFixed(3)} GOLOS</Money>
                        {authorGbg ? (
                            <Fragment>
                                <Plus>+</Plus>
                                <Money>{authorGbg.toFixed(3)} GBG</Money>
                            </Fragment>
                        ) : null}
                        <HintIcon hint={tt('payout_info.author_hint')} />
                    </Line>
                    <Line>
                        <Label>{tt('payout_info.curator')}</Label>
                        <Money>{curator.toFixed(3)} GOLOS</Money>
                        <HintIcon hint={tt('payout_info.curator_hint')} />
                    </Line>
                    <Line>
                        <Label>{tt('payout_info.beneficiary')}</Label>
                        <Money>{benefactor.toFixed(3)} GOLOS</Money>
                        <HintIcon hint={tt('payout_info.beneficiary_hint')} />
                    </Line>
                </Part>
            </Root>
        );
    }
}
