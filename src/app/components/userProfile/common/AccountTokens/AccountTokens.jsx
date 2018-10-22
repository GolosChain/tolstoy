import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import CollapsingBlock from 'golos-ui/CollapsingBlock';
import PieChart from 'src/app/components/common/PieChart';

const Root = styled.div``;

const ChartBlock = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px 0;
    border-bottom: 1px solid #e9e9e9;
`;

const ChartWrapper = styled.div`
    width: 170px;
    height: 170px;
`;

const Labels = styled.div``;

const CollapsingBlockStyled = styled(CollapsingBlock)`
    border-bottom: 1px solid #e9e9e9;

    &:last-child {
        border-bottom: none;
    }
`;

const Label = styled.div`
    display: flex;
    height: 52px;
    box-sizing: content-box;
    align-items: center;
`;

const ColorMark = styled.div`
    width: 14px;
    height: 14px;
    margin-right: 12px;
    border-radius: 2px;
    flex-shrink: 0;
`;

const SubColorMark = styled(ColorMark)`
    width: 8px;
    height: 8px;
    margin-left: 4px;
    margin-right: 15px;
    border-radius: 50%;
`;

const LabelTitle = styled.div`
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    text-overflow: ellipsis;
`;

const LabelValue = styled.div`
    flex-shrink: 0;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.7px;
`;

const LabelBody = styled.div`
    padding: 0 20px 10px;
`;

const SubLabel = styled.div`
    display: flex;
    height: 30px;
    box-sizing: content-box;
    align-items: center;
    margin-right: 24px;

    ${LabelTitle} {
        font-size: 13px;
    }

    ${LabelValue} {
        font-size: 13px;
        font-weight: 500;
    }
`;

export default class AccountTokens extends PureComponent {
    state = {
        hoverIndex: null,
        collapsed: false,
    };

    render() {
        const { golos, golosSafe, gold, goldSafe, power, powerDelegated, gbgPerGolos } = this.props;

        const { hoverIndex } = this.state;

        const labels = [
            {
                id: 'golos',
                title: tt('token_names.LIQUID_TOKEN'),
                color: '#2879ff',
                values: [
                    {
                        title: tt('user_profile.account_tokens.tokens.wallet'),
                        value: golos,
                    },
                    {
                        title: tt('user_profile.account_tokens.tokens.savings'),
                        value: golosSafe,
                    },
                ],
            },
            {
                id: 'gold',
                title: tt('token_names.DEBT_TOKEN'),
                color: '#ffb839',
                rate: gbgPerGolos,
                values: [
                    {
                        title: tt('user_profile.account_tokens.tokens.wallet'),
                        value: gold,
                    },
                    {
                        title: tt('user_profile.account_tokens.tokens.savings'),
                        value: goldSafe,
                    },
                ],
            },
            {
                id: 'power',
                title: tt('token_names.VESTING_TOKEN'),
                color: '#78c2d0',
                values: [
                    {
                        title: tt('user_profile.account_tokens.tokens.wallet'),
                        value: power,
                    },
                    {
                        title: tt('user_profile.account_tokens.tokens.delegated'),
                        value: powerDelegated,
                    },
                ],
            },
        ];

        for (let label of labels) {
            let sum = 0;

            for (let { value } of label.values) {
                sum += parseFloat(value);
            }

            label.value = sum.toFixed(3);
        }

        return (
            <Root>
                <ChartBlock>
                    <ChartWrapper>
                        <PieChart
                            parts={labels.map((label, i) => ({
                                isBig: i === hoverIndex,
                                value: parseFloat(label.value) / (label.rate || 1),
                                color: label.color,
                            }))}
                        />
                    </ChartWrapper>
                </ChartBlock>
                <Labels>
                    {labels.map((label, i) => (
                        <CollapsingBlockStyled
                            key={label.id}
                            initialCollapsed
                            saveStateKey={`tokens_${label.id}`}
                            onMouseEnter={() => this._onHover(i)}
                            onMouseLeave={() => this._onHoverOut(i)}
                            title={() => (
                                <Label>
                                    <ColorMark style={{ backgroundColor: label.color }} />
                                    <LabelTitle>{label.title}</LabelTitle>
                                    <LabelValue>{label.value}</LabelValue>
                                </Label>
                            )}
                        >
                            <LabelBody>
                                {label.values.map((subLabel, i) => (
                                    <SubLabel key={i}>
                                        <SubColorMark style={{ backgroundColor: label.color }} />
                                        <LabelTitle>{subLabel.title}</LabelTitle>
                                        <LabelValue>{subLabel.value}</LabelValue>
                                    </SubLabel>
                                ))}
                            </LabelBody>
                        </CollapsingBlockStyled>
                    ))}
                </Labels>
            </Root>
        );
    }

    _onHover = idx => {
        this.setState({
            hoverIndex: idx,
        });
    };

    _onHoverOut = idx => {
        if (this.state.hoverIndex === idx) {
            this.setState({
                hoverIndex: null,
            });
        }
    };
}
