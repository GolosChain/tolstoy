import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ByteBuffer from 'bytebuffer';
import { is } from 'immutable';
import tt from 'counterpart';

import './Witnesses.scss';

import {
    firstBreakPoint,
    firstBreakPointStrTemplate,
    secondBreakPoint,
    secondBreakPointStrTemplate,
    stringTemplate,
    thirdBreakPoint,
    thirdBreakPointStrTemplate,
} from 'src/app/containers/Witnesses/WitnessesStrings/WitnessesString';
import WitnessesStrings from 'src/app/containers/Witnesses/WitnessesStrings/WitnessesStrings';

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

    @media (max-width: ${firstBreakPoint}px) {
        max-width: 750px;
    }
    @media (max-width: ${secondBreakPoint}px) {
        max-width: 500px;
    }
    @media (max-width: ${thirdBreakPoint}px) {
        max-width: 320px;
    }
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

const TableWrapper = styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const TableHeadItem = styled.div`
    align-self: center;
    padding-left: 16px;
    font-weight: bold;
    line-height: 1.2;
    color: #393636;
`;

const PercentHeadItem = styled(TableHeadItem)`
    justify-self: center;
    padding-left: 0;
`;

const VotesHeadItem = styled(TableHeadItem)`
    @media (max-width: ${thirdBreakPoint}px) {
        display: none;
    }
`;

const InfoHeadItem = styled(TableHeadItem)`
    @media (max-width: ${firstBreakPoint}px) {
        display: none;
    }
`;

const MissedBlocksHeadItem = styled(TableHeadItem)`
    @media (max-width: ${secondBreakPoint}px) {
        display: none;
    }
`;

const LastBlockHeadItem = styled(TableHeadItem)`
    @media (max-width: ${secondBreakPoint}px) {
        display: none;
    }
`;

const PriceFeedHeadItem = styled(TableHeadItem)`
    @media (max-width: ${firstBreakPoint}px) {
        display: none;
    }
`;

const TableHead = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: ${stringTemplate};
    grid-template-rows: 56px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    background-color: #ffffff;

    & ${TableHeadItem}:first-child {
        justify-self: start;
        padding-left: 16px;
    }

    @media (max-width: ${firstBreakPoint}px) {
        grid-template-columns: ${firstBreakPointStrTemplate};
    }
    @media (max-width: ${secondBreakPoint}px) {
        grid-template-columns: ${secondBreakPointStrTemplate};
    }
    @media (max-width: ${thirdBreakPoint}px) {
        grid-template-columns: ${thirdBreakPointStrTemplate};
    }
`;

const VoteForWitness = styled.div`
    margin-top: 30px;
`;

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

    accountWitnessVote = (accountName, approve) => {
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
        const { witnessVotes, currentProxy, totalVestingShares, witnesses } = this.props;
        const { customUsername } = this.state;

        const sorted_witnesses = witnesses.sort((a, b) =>
            Long.fromString(String(b.get('votes'))).subtract(
                Long.fromString(String(a.get('votes'))).toString()
            )
        );

        let witness_vote_count = 30;
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
                                        />
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
                        <TableWrapper>
                            <TableHead>
                                <TableHeadItem>{tt('witnesses_jsx.witness')}</TableHeadItem>
                                <TableHeadItem />
                                <PercentHeadItem>%</PercentHeadItem>
                                <VotesHeadItem>{tt('witnesses_jsx.approval')}</VotesHeadItem>
                                <InfoHeadItem>{tt('witnesses_jsx.information')}</InfoHeadItem>
                                <MissedBlocksHeadItem>
                                    <div>{tt('witnesses_jsx.missed_1')}</div>
                                    <div>{tt('witnesses_jsx.missed_2')}</div>
                                </MissedBlocksHeadItem>
                                <LastBlockHeadItem>
                                    <div>{tt('witnesses_jsx.last_block1')}</div>
                                    <div>{tt('witnesses_jsx.last_block2')}</div>
                                </LastBlockHeadItem>
                                <PriceFeedHeadItem>
                                    {tt('witnesses_jsx.price_feed')}
                                </PriceFeedHeadItem>
                                <TableHeadItem />
                            </TableHead>
                            <WitnessesStrings
                                sortedWitnesses={sorted_witnesses}
                                witnessVotes={witnessVotes}
                                totalVestingShares={totalVestingShares}
                            />
                        </TableWrapper>
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
