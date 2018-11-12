import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon';
import DialogManager from 'app/components/elements/common/DialogManager';
import { boldify } from 'src/app/helpers/text';

const Root = styled.div`
    display: flex;
    align-items: center;
    height: 50px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const Text = styled.div`
    flex: 1;
    margin-left: 20px;
    font-size: 14px;
    color: #393636;
`;

const Action = styled.button.attrs({ type: 'button' })`
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 33px;
    margin-left: 10px;
    border-left: 1px solid #e1e1e1;
    border-radius: 0;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1.64px;
    color: #393636;
    cursor: pointer;

    &:hover {
        color: #000;
    }
`;

const ActionIcon = styled(Icon)`
    height: 17px;
    margin-right: 12px;
`;

export default class PowerDownLine extends Component {
    static propTypes = {
        accountName: PropTypes.string.isRequired,

        // connect
        toWithdraw: PropTypes.string,
        withdrawn: PropTypes.string,
        cancelPowerDown: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
    };

    onCancelClick = () => {
        const { accountName } = this.props;

        this.props.cancelPowerDown(accountName, err => {
            if (err) {
                DialogManager.alert(err, tt('g.error'));
            } else {
                this.props.showNotification(err);
            }
        });
    };

    render() {
        const { toWithdraw, withdrawn } = this.props;

        if (!toWithdraw) {
            return null;
        }

        return (
            <Root>
                <Text>
                    {boldify(
                        tt('wallet.power_down_line', {
                            all: toWithdraw,
                            done: withdrawn,
                        })
                    )}
                </Text>
                <Action onClick={this.onCancelClick}>
                    <ActionIcon name="round-cross" />
                    {tt('wallet.cancel')}
                </Action>
            </Root>
        );
    }
}
