import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import { TabContainer, Tabs } from 'golos-ui/Tabs';
import { CardContent } from 'golos-ui/Card';
import Icon from 'golos-ui/Icon';
import SplashLoader from 'golos-ui/SplashLoader';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import Linkify from 'src/app/components/common/Linkify';
import TextCut from 'src/app/components/common/TextCut';
import EditGolosPower from 'src/app/components/userProfile/common/EditGolosPower';
import DialogManager from 'app/components/elements/common/DialogManager';
import { golosToVests, getVesting } from 'app/utils/StateFunctions';
import { MIN_VOICE_POWER } from 'app/client_config';
import {
    DIRECTION,
    CURRENCY_TRANSLATE,
    CURRENCY_COLOR,
} from 'src/app/containers/userProfile/wallet/WalletContent';

const MONTHS = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
];

const Root = styled.div`
    &:nth-child(even) {
        background: #f8f8f8;
    }
`;

const Line = styled.div`
    display: flex;
    align-items: flex-start;
    padding: 0 20px;
`;

const LineIcon = styled(Icon)`
    flex-shrink: 0;
    width: 24px;
    height: 80px;
    margin-right: 16px;
    color: ${props => props.color || '#b7b7ba'};
`;

const Who = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    flex-basis: 10px;
    height: 80px;
    overflow: hidden;
`;

const WhoName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const WhoTitle = styled.div``;

const WhoLink = styled(Link)`
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const TimeStamp = styled.div`
    font-size: 12px;
    color: #959595;
`;

const Memo = styled.div`
    display: flex;
    flex-grow: 1.5;
    flex-basis: 10px;
    overflow: hidden;
`;

const MemoIcon = styled(Icon)`
    display: block;
    flex-shrink: 0;
    flex-basis: 24px;
    margin-top: 28px;
    margin-right: 12px;
    color: #333;
    transition: color 0.15s;

    ${is('text')}:hover {
        color: #3684ff;
    }
`;

const MemoCut = styled(TextCut)`
    flex-grow: 1;
    margin: 15px 0;
`;

const MemoCentrer = styled.div`
    &::after {
        display: inline-block;
        content: '';
        height: 50px;
        vertical-align: middle;
    }
`;

const MemoText = styled.div`
    display: inline-block;
    width: 100%;
    padding: 4px 0;
    line-height: 1.4em;
    vertical-align: middle;
    word-wrap: break-word;
`;

const DataLink = styled(Link)`
    flex-grow: 1;
    flex-basis: 10px;
    max-height: 40px;
    margin-right: 8px;
    line-height: 1.3em;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Currencies = styled.div`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    height: 80px;
    margin-left: 6px;
    overflow: hidden;
`;

const ListValue = styled.div`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    flex-direction: column;
    margin-right: 9px;

    &:last-child {
        margin-right: 0;
    }
`;

const Value = styled.div`
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    align-items: flex-end;
    width: 80px;
    height: 80px;
    justify-content: center;
`;

const Amount = styled.div`
    margin-top: 2px;
    line-height: 24px;
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.color || '#b7b7ba'};
    white-space: nowrap;
    overflow: hidden;
`;

const Currency = styled.div`
    font-size: 12px;
    color: #757575;
    white-space: nowrap;
    overflow: hidden;
`;

const DateWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const DateSplitter = styled.div`
    height: 30px;
    line-height: 30px;
    padding: 0 13px;
    margin: -15px 0;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 300;
    color: #333;
    background: #fff;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
    cursor: default;
`;

const EditDelegationBlock = styled.div`
    height: 0;
    padding: 0 20px;
    transition: height 0.15s;
    overflow: hidden;
    will-change: height;
`;

const Actions = styled.div`
    display: flex;
    align-items: center;
    flex-basis: 10px;
    flex-grow: 0.5;
    height: 80px;
`;

const ActionIcon = styled(Icon)`
    width: 36px;
    height: 36px;
    padding: 8px;
    margin-right: 20px;
    user-select: none;
    color: #333;
    cursor: pointer;
    transition: color 0.15s;

    &:last-child {
        margin-right: 0;
    }

    &:hover {
        color: ${props => props.color};
    }
`;

export default class WalletLine extends PureComponent {
    static propTypes = {
        data: PropTypes.object.isRequired,
        account: PropTypes.any,
        delegationData: PropTypes.array,
        delegate: PropTypes.func.isRequired,
        onLoadDelegationsData: PropTypes.func.isRequired,
    };

    state = {
        editDelegationId: null,
        loaderForId: null,
        startEditDelegationGrow: false,
    };

    render() {
        const { data } = this.props;
        const { loaderForId } = this.state;

        return (
            <Root>
                {data.addDate ? (
                    <DateWrapper>
                        <DateSplitter>
                            {data.stamp.getDate() + ' ' + MONTHS[data.stamp.getMonth()]}
                        </DateSplitter>
                    </DateWrapper>
                ) : null}
                <Line>
                    <LineIcon name={data.icon} color={data.color} />
                    <Who>
                        {data.name ? (
                            <WhoName>
                                {data.type === DIRECTION.SENT ? 'Для ' : 'От '}
                                <WhoLink to={`/@${data.name}`}>@{data.name}</WhoLink>
                            </WhoName>
                        ) : null}
                        {data.title ? <WhoTitle>{data.title}</WhoTitle> : null}
                        {data.post ? this._renderPostLink(data.post) : null}
                        <TimeStamp>
                            <TimeAgoWrapper date={data.stamp} />
                        </TimeStamp>
                    </Who>
                    {data.memo ? (
                        <Memo>
                            <MemoIcon
                                name="note"
                                text={data.memoIconText}
                                data-tooltip={data.memoIconText}
                            />
                            <MemoCut height={50}>
                                <MemoCentrer>
                                    <MemoText>
                                        <Linkify>{data.memo}</Linkify>
                                    </MemoText>
                                </MemoCentrer>
                            </MemoCut>
                        </Memo>
                    ) : null}
                    {data.data ? <DataLink to={data.link}>{data.data}</DataLink> : null}
                    {data.showDelegationActions ? this._renderDelegationActions(data.id) : null}
                    {data.currencies ? (
                        <Currencies>
                            {data.currencies.map(({ amount, currency }) => (
                                <ListValue key={currency}>
                                    <Amount color={CURRENCY_COLOR[currency]}>{amount}</Amount>
                                    <Currency>{CURRENCY_TRANSLATE[currency]}</Currency>
                                </ListValue>
                            ))}
                        </Currencies>
                    ) : (
                        <Value>
                            <Amount color={data.color}>{data.amount}</Amount>
                            <Currency>{CURRENCY_TRANSLATE[data.currency]}</Currency>
                        </Value>
                    )}
                </Line>
                {this._renderEditDelegation(data.id, data.amount)}
                {loaderForId && loaderForId === data.id ? <SplashLoader light /> : null}
            </Root>
        );
    }

    _renderEditDelegation(id, amount) {
        const { editDelegationId } = this.state;

        if (editDelegationId === id) {
            const { account, delegationData, globalProps } = this.props;
            const { startEditDelegationGrow } = this.state;

            const { golos } = getVesting(account, globalProps);

            const availableBalance = Math.max(
                0,
                Math.round((parseFloat(golos) - MIN_VOICE_POWER) * 1000)
            );

            const value = Math.round(Math.abs(parseFloat(amount)) * 1000);

            const data = delegationData.find(data => data.id === id);

            return (
                <EditDelegationBlock style={{ height: startEditDelegationGrow ? 118 : 0 }}>
                    <EditGolosPower
                        value={value}
                        max={availableBalance + value}
                        onSave={value => this._onDelegationSaveClick(data, value)}
                        onCancel={this._onDelegationEditCancelClick}
                    />
                </EditDelegationBlock>
            );
        }
    }

    _renderDelegationActions(id) {
        const { loaderForId } = this.state;

        return (
            <Actions>
                <ActionIcon
                    color="#3684ff"
                    name="pen"
                    data-tooltip="Редактировать делегирование"
                    onClick={loaderForId ? null : () => this._onEditDelegationClick(id)}
                />
                <ActionIcon
                    color="#fc544e"
                    name="round-cross"
                    data-tooltip="Отменить делегирование"
                    onClick={loaderForId ? null : () => this._onCancelDelegationClick(id)}
                />
            </Actions>
        );
    }

    _onEditDelegationClick = id => {
        const { editDelegationId, startEditDelegationGrow } = this.state;

        if (editDelegationId === id && startEditDelegationGrow) {
            this.setState({
                startEditDelegationGrow: false,
            });
        } else {
            this.setState(
                {
                    editDelegationId: id,
                    startEditDelegationGrow: false,
                },
                () => {
                    setTimeout(() => {
                        this.setState({
                            startEditDelegationGrow: true,
                        });
                    }, 50);
                }
            );
        }
    };

    _onDelegationEditCancelClick = () => {
        this.setState({
            startEditDelegationGrow: false,
        });
    };

    _onDelegationSaveClick = (item, value) => {
        const { loaderForId } = this.state;

        if (loaderForId) {
            return;
        }

        this._updateDelegation(item, value);
    };

    _onCancelDelegationClick = async id => {
        if (await DialogManager.dangerConfirm()) {
            const data = this.data.delegationData.find(data => data.id === id);

            this._updateDelegation(data, 0);
        }
    };

    _updateDelegation({ id, delegatee }, value) {
        const { myAccountName, globalProps } = this.props;

        const vesting = value > 0 ? golosToVests(value / 1000, globalProps) : '0.000000';

        const operation = {
            delegator: myAccountName,
            delegatee: delegatee,
            vesting_shares: vesting + ' GESTS',
        };

        this.setState({
            loaderForId: id,
        });

        this.props.delegate(operation, err => {
            if (err) {
                this.setState({
                    loaderForId: null,
                });

                if (err !== 'Canceled') {
                    DialogManager.alert(err.toString());
                }
            } else {
                this.setState({
                    loaderForId: null,
                    editDelegationId: null,
                });

                this.props.onLoadDelegationsData();
            }
        });
    }
}
