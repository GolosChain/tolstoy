import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';
import DialogManager from 'app/components/elements/common/DialogManager';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';

const Text = styled.div`
    flex: 1;
    margin-left: 18px;
`;

const Line = styled.div`
    line-height: 20px;
    font-size: 14px;
    color: #393636;

    @media (max-width: 500px) {
        font-size: 16px;
    }
`;

const ButtonWrapper = styled.div`
    margin: 0 10px 0 20px;
`;

const ButtonStyled = styled(Button)`
    font-size: 14px;
    background: #f8f8f8;
`;

const ActionIcon = styled(Icon)`
    height: 17px;
    margin-right: 2px;
`;

const TimeAgoStyled = styled(TimeAgoWrapper)`
    font-weight: bold;
`;

const Root = styled.div`
    display: flex;
    align-items: center;
    padding: 9px 0;
    border: 1px solid #e9e9e9;
    border-radius: 7px 7px 0 0;
    background: #f8f8f8;

    @media (max-width: 890px) {
        border-radius: 0;
    }

    @media (max-width: 850px) {
        flex-direction: column;

        ${Line} {
            line-height: 24px;
        }

        ${Text} {
            margin: 0 18px;
        }

        ${ButtonWrapper} {
            margin: 10px auto 4px;
        }
    }
`;

export default class PowerDownLine extends Component {
    static propTypes = {
        accountName: PropTypes.string.isRequired,

        // connect
        toWithdraw: PropTypes.string,
        withdrawn: PropTypes.string,
        nextWithdrawal: PropTypes.string,
        cancelPowerDown: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
    };

    onCancelClick = () => {
        const { accountName } = this.props;

        this.props.cancelPowerDown(accountName, err => {
            if (err) {
                if (err === 'Canceled') {
                    // Do nothing
                } else {
                    DialogManager.alert(err, tt('g.error'));
                }
            } else {
                this.props.showNotification(tt('wallet.success'));
            }
        });
    };

    render() {
        const { toWithdraw, withdrawn, nextWithdrawal } = this.props;

        if (!toWithdraw) {
            return null;
        }

        return (
            <Root>
                <Text>
                    <Line>
                        {tt('wallet.power_down_line', {
                            all: toWithdraw,
                            done: withdrawn,
                        }).replace(/\*\*/g, '')}
                    </Line>
                    <Line>
                        {tt('wallet.next_power_down_date')}
                        <TimeAgoStyled date={nextWithdrawal} />
                    </Line>
                </Text>
                <ButtonWrapper>
                    <ButtonStyled light onClick={this.onCancelClick}>
                        <ActionIcon name="round-cross" />
                        {tt('wallet.cancel')}
                    </ButtonStyled>
                </ButtonWrapper>
            </Root>
        );
    }
}
