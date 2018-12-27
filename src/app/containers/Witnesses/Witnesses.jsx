import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ByteBuffer from 'bytebuffer';
import { is } from 'immutable';
import tt from 'counterpart';

import links from 'app/utils/Links';
import Icon from 'app/components/elements/Icon';
import './Witnesses.scss';

import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';

import { formatDecimal } from 'app/utils/ParsersAndFormatters';

const Long = ByteBuffer.Long;

const WrapperForBackground = styled.div`
    background-color: #f9f9f9;

    & button {
        outline: none;
    }
`;

const Wrapper = styled.div`
    max-width: 1150px;
    margin: 0 auto;
`;

const Header = styled.div`
    padding-top: 30px;
`;

const HeaderTitle = styled.h2`
    margin-bottom: 10px;
    font-family: 'Open Sans', sans-serif;
    font-size: 34px;
    font-weight: bold;
    line-height: 1.21;
    letter-spacing: 0.4px;
    color: #333333;
`;

const HeaderSubtitle = styled.p`
    margin-bottom: 30px;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    letter-spacing: 0.2px;
    color: #393636;
`;

const VoteForWitness = styled.div``;

export class Witnesses extends Component {
    static propTypes = {
        witnesses: PropTypes.object.isRequired,
        accountWitnessVote: PropTypes.func.isRequired,
        loginIfNeed: PropTypes.func.isRequired,
        username: PropTypes.string,
        witnessVotes: PropTypes.object,
    };

    state = {
        customUsername: '',
        proxy: '',
        proxyFailed: false,
    };

    shouldComponentUpdate(np, ns) {
        return (
            !is(np.witnessVotes, this.props.witnessVotes) ||
            np.witnesses !== this.props.witnesses ||
            np.currentProxy !== this.props.currentProxy ||
            np.username !== this.props.username ||
            ns.customUsername !== this.state.customUsername ||
            ns.proxy !== this.state.proxy ||
            ns.proxyFailed !== this.state.proxyFailed
        );
    }

    accountWitnessVote = (accountName, approve, e) => {
        e.preventDefault();

        this.setState({ customUsername: '' });
        this.props.loginIfNeed(logged => {
            if (logged) {
                this.props.accountWitnessVote(this.props.username, accountName, approve);
            }
        });
    };

    onWitnessChange = e => {
        const customUsername = e.target.value;
        this.setState({ customUsername });
    };

    render() {
        const { witnessVotes, currentProxy, totalVestingShares } = this.props;

        const { customUsername } = this.state;
        const sorted_witnesses = this.props.witnesses.sort((a, b) =>
            Long.fromString(String(b.get('votes'))).subtract(
                Long.fromString(String(a.get('votes'))).toString()
            )
        );

        const up = <Icon name="chevron-up-circle" />;
        let witness_vote_count = 30;
        let rank = 1;

        const witnesses = sorted_witnesses.map(item => {
            const owner = item.get('owner');
            const thread = item.get('url');
            const votes = item.get('votes');
            const missed = item.get('total_missed');
            const lastBlock = item.get('last_confirmed_block_num');
            const lastUpdateFeed = item.get('last_sbd_exchange_update');
            const priceFeed = item.get('sbd_exchange_rate');
            const version = item.get('running_version');
            const signingKey = item.get('signing_key');
            const props = item.get('props').toJS();

            //https://github.com/roadscape/db.steemd.com/blob/acabdcb7c7a9c9c4260a464ca86ae4da347bbd7a/app/views/witnesses/index.html.erb#L116
            const oneM = Math.pow(10, 6);
            const approval = votes / oneM / oneM;
            const percentage = 100 * (votes / oneM / totalVestingShares.split(' ')[0]);

            const lastFeedDate = new Date(lastUpdateFeed).getTime();
            const isOneDayAgo = lastFeedDate < new Date().setDate(new Date().getDate() - 1);
            const isOneWeekAgo = lastFeedDate < new Date().setDate(new Date().getDate() - 7);

            const isWitnessesDeactive = /GLS1111111111111111111111111111111114T1Anm/.test(
                signingKey
            );
            const noPriceFeed = /0.000 GOLOS/.test(priceFeed.get('base'));

            let lastUpdateFeedClassName;
            if (isOneDayAgo) {
                lastUpdateFeedClassName = 'warning';
            }

            if (isOneWeekAgo) {
                lastUpdateFeedClassName = 'error';
            }

            const myVote = witnessVotes ? witnessVotes.has(owner) : null;
            const classUp = 'VotingButton' + (myVote === true ? ' VotingButton_upvoted' : '');
            let witness_thread = '';
            if (thread) {
                if (links.local.test(thread)) {
                    witness_thread = <Link to={thread}>{tt('witnesses_jsx.witness_thread')}</Link>;
                } else {
                    witness_thread = (
                        <a href={thread}>
                            {tt('witnesses_jsx.witness_thread')}
                            &nbsp;
                            <Icon name="extlink" />
                        </a>
                    );
                }
            }
            return (
                <tr
                    key={owner}
                    style={isWitnessesDeactive || noPriceFeed ? { opacity: '0.4' } : null}
                    title={
                        isWitnessesDeactive
                            ? tt('witnesses_jsx.witness_deactive')
                            : noPriceFeed
                            ? tt('witnesses_jsx.no_price_feed')
                            : null
                    }
                >
                    <td width="75">
                        {rank < 10 && '0'}
                        {rank++}
                        &nbsp;&nbsp;
                        <span className={classUp}>
                            <a
                                href="#"
                                className="VotingButton__link"
                                onClick={e => this.accountWitnessVote(owner, !myVote, e)}
                                title={tt('g.vote')}
                            >
                                {up}
                            </a>
                        </span>
                    </td>
                    <td style={rank <= 20 ? { fontWeight: 'bold' } : null}>
                        <Link to={'/@' + owner}>{owner}</Link>
                    </td>
                    <td>
                        {formatDecimal(approval.toFixed(), 0)}
                        <span style={{ fontSize: '65%', opacity: '.5' }}>M</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{percentage.toFixed(2)}%</td>
                    <td>{witness_thread}</td>
                    <td style={{ textAlign: 'center' }}>{missed}</td>
                    <td>{lastBlock}</td>
                    <td>
                        <div style={{ fontSize: '.9rem', fontWeight: 'bold' }}>
                            {priceFeed.get('quote')}
                        </div>
                        <div style={{ fontSize: '.9rem' }}>{priceFeed.get('base')}</div>
                        <div style={{ fontSize: '1rem' }}>
                            <TimeAgoWrapper
                                date={lastUpdateFeed}
                                className={lastUpdateFeedClassName}
                            />
                        </div>
                    </td>
                    <td>
                        <div style={{ fontSize: '.9rem' }} title={tt('witnesses_jsx.reg_fee')}>
                            {props.account_creation_fee}
                        </div>
                        <div style={{ fontSize: '.9rem' }} title={tt('witnesses_jsx.apr')}>
                            {props.sbd_interest_rate / 100}%
                        </div>
                        <div style={{ fontSize: '.9rem' }} title={tt('witnesses_jsx.block_size')}>
                            {props.maximum_block_size}
                        </div>
                    </td>
                    <td>{version}</td>
                </tr>
            );
        });

        let addlWitnesses = false;

        if (witnessVotes) {
            witness_vote_count -= witnessVotes.size;
            addlWitnesses = witnessVotes
                .filter(item => {
                    return !sorted_witnesses.has(item);
                })
                .map(item => {
                    return (
                        <div className="row" key={item}>
                            <div className="column small-12">
                                <span>
                                    <span className="VotingButton VotingButton_upvoted space-right">
                                        <a
                                            className="VotingButton__link"
                                            href="#"
                                            onClick={this.accountWitnessVote.bind(
                                                this,
                                                item,
                                                false
                                            )}
                                            title={tt('g.vote')}
                                        >
                                            {up}
                                        </a>
                                        &nbsp;
                                    </span>
                                </span>
                                <Link to={'/@' + item}>{item}</Link>
                            </div>
                        </div>
                    );
                })
                .toArray();
        }

        return (
            <WrapperForBackground>
                <Wrapper>
                    <Header>
                        <HeaderTitle>{tt('witnesses_jsx.top_witnesses')}</HeaderTitle>
                        {currentProxy && currentProxy.length ? null : (
                            <HeaderSubtitle>
                                <strong>
                                    {tt('witnesses_jsx.you_have_votes_remaining') +
                                        tt('witnesses_jsx.you_have_votes_remaining_count', {
                                            count: witness_vote_count,
                                        })}
                                    .
                                </strong>{' '}
                                {tt('witnesses_jsx.you_can_vote_for_maximum_of_witnesses')}.
                            </HeaderSubtitle>
                        )}
                    </Header>

                    {currentProxy && currentProxy.length ? null : (
                        <div className="row small-collapse">
                            <div className="column">
                                <table>
                                    <thead>
                                        <tr>
                                            <th />
                                            <th>{tt('witnesses_jsx.witness')}</th>
                                            <th>{tt('witnesses_jsx.approval')}</th>
                                            <th style={{ textAlign: 'center' }}>%</th>
                                            <th>{tt('witnesses_jsx.information')}</th>
                                            <th style={{ textAlign: 'center' }}>
                                                <div>{tt('witnesses_jsx.missed_1')}</div>
                                                <div>{tt('witnesses_jsx.missed_2')}</div>
                                            </th>
                                            <th style={{ textAlign: 'center' }}>
                                                {tt('witnesses_jsx.last_block')}
                                            </th>
                                            <th>{tt('witnesses_jsx.price_feed')}</th>
                                            <th>{tt('witnesses_jsx.props')}</th>
                                            <th>{tt('witnesses_jsx.version')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>{witnesses.toArray()}</tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {currentProxy && currentProxy.length ? null : (
                        <VoteForWitness>
                            <p>
                                {tt(
                                    'witnesses_jsx.if_you_want_to_vote_outside_of_top_enter_account_name'
                                )}
                                .
                            </p>
                            <form>
                                <div className="input-group">
                                    <input
                                        className="input-group-field"
                                        type="text"
                                        style={{
                                            float: 'left',
                                            width: '75%',
                                            maxWidth: '20rem',
                                        }}
                                        value={customUsername}
                                        onChange={this.onWitnessChange}
                                    />
                                    <div className="input-group-button">
                                        <button
                                            className="button"
                                            onClick={e =>
                                                this.accountWitnessVote(
                                                    customUsername,
                                                    witnessVotes
                                                        ? !witnessVotes.has(customUsername)
                                                        : true,
                                                    e
                                                )
                                            }
                                        >
                                            {tt('g.vote')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <br />
                            {addlWitnesses}
                            <br />
                            <br />
                        </VoteForWitness>
                    )}
                </Wrapper>
            </WrapperForBackground>
        );
    }
}
