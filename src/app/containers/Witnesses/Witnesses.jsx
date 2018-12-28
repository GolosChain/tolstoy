import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import styledIs from 'styled-is';
import ByteBuffer from 'bytebuffer';
import { is } from 'immutable';
import tt from 'counterpart';

import links from 'app/utils/Links';
import './Witnesses.scss';

import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import Icon from 'golos-ui/Icon';

import { formatDecimal } from 'app/utils/ParsersAndFormatters';
import CloseOpenButton from 'src/app/components/cards/CloseOpenButton';

const Long = ByteBuffer.Long;

const stringTemplate = '170px 70px 90px 115px 160px 120px 140px 225px 60px';
const firstBreakPoint = 1180;
const firstBreakPointStrTemplate = '165px 70px 90px 115px 120px 130px 60px';
const secondBreakPoint = 767;
const secondBreakPointStrTemplate = '165px 70px 90px 115px 60px';
const thirdBreakPoint = 530;
const thirdBreakPointStrTemplate = '140px 50px 80px 50px';

const ellipsisStyles = `
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

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

const WitnessInfoCeil = styled.div`
    align-self: center;
    padding-left: 16px;
`;

const WitnessNumberAndName = styled(WitnessInfoCeil)`
    display: flex;

    & > * {
        font-weight: bold;
        color: #393636;
    }

    & > a {
        margin-left: 12px;
        ${ellipsisStyles};
    }

    & > a:hover {
        color: #2879ff;
    }
`;

const VoteButtonCeil = styled(WitnessInfoCeil)`
    justify-self: center;
    padding-left: 0;
`;

const PercentsCeil = styled(WitnessInfoCeil)`
    line-height: 1.29;
    letter-spacing: 0.4px;
`;

const AllVotesCeil = styled(WitnessInfoCeil)`
    line-height: 1.29;
    letter-spacing: 0.4px;

    & > span {
        font-size: 10px;
        color: #959595;
    }

    @media (max-width: ${thirdBreakPoint}px) {
        display: none;
    }
`;

const FeedCeil = styled(WitnessInfoCeil)`
    font-family: 'Open Sans', sans-serif;
    line-height: 1.4;

    @media (max-width: ${firstBreakPoint}px) {
        display: none;
    }
`;

const PostLinkCeil = styled(WitnessInfoCeil)`
    position: relative;
    text-transform: capitalize;

    & > a {
        color: #2879ff;
    }

    & > a:hover {
        text-decoration: underline;
    }

    & ${Icon} {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 8px;
        color: #2879ff;
    }

    @media (max-width: ${firstBreakPoint}px) {
        display: none;
    }
`;

const MissedCeil = styled(WitnessInfoCeil)`
    ${ellipsisStyles};

    @media (max-width: ${secondBreakPoint}px) {
        display: none;
    }
`;

const LastBlockCeil = styled(WitnessInfoCeil)`
    ${ellipsisStyles};

    @media (max-width: ${secondBreakPoint}px) {
        display: none;
    }
`;

const ToggleStringCeil = styled(WitnessInfoCeil)`
    justify-self: center;
    padding-left: 0;
`;

const WitnessString = styled.div`
    display: grid;
    grid-template-columns: ${stringTemplate};
    grid-template-rows: 55px;
    background-color: #ffffff;
    border-bottom: 1px solid #e1e1e1;

    & ${WitnessInfoCeil}:last-child {
        justify-self: end;
        padding-right: 16px;
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

const VoteButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: #2879ff;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
        ${({ upvoted }) =>
            upvoted ? 'border: 1px solid rgba(57, 54, 54, 0.6);' : 'background-color: #0e69ff'};
    }

    ${styledIs('upvoted')`
        border: 1px solid rgba(57, 54, 54, 0.3);
        background-color: #ffffff;
    `};

    & svg {
        color: #${({ upvoted }) => (upvoted ? '393636' : 'ffffff')};
        flex-shrink: 0;
    }
`;

const PriceFeedQuote = styled.span`
    font-weight: bold;
`;

const PriceFeedTokens = styled.div`
    white-space: nowrap;
`;

const LastFeedTime = styled.div`
    font-size: 12px;
    color: #959595;
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
        const { witnessVotes, currentProxy, totalVestingShares } = this.props;

        const { customUsername } = this.state;
        const sorted_witnesses = this.props.witnesses.sort((a, b) =>
            Long.fromString(String(b.get('votes'))).subtract(
                Long.fromString(String(a.get('votes'))).toString()
            )
        );

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
            let witness_thread = '';
            if (thread) {
                if (links.local.test(thread)) {
                    witness_thread = <Link to={thread}>{tt('witnesses_jsx.witness_thread')}</Link>;
                } else {
                    witness_thread = (
                        <a href={thread}>
                            {tt('witnesses_jsx.witness_thread')}
                            <Icon name="external-link" size="13" />
                        </a>
                    );
                }
            }
            return (
                <WitnessString
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
                    <WitnessNumberAndName>
                        <div>{rank++}</div>
                        <Link to={'/@' + owner}>{owner}</Link>
                    </WitnessNumberAndName>
                    <VoteButtonCeil>
                        <VoteButton
                            onClick={() => this.accountWitnessVote(owner, !myVote)}
                            title={tt('g.vote')}
                            upvoted={myVote ? 1 : 0}
                        >
                            <Icon name={myVote ? 'opposite-witness' : 'witness-logo'} size="16" />
                        </VoteButton>
                    </VoteButtonCeil>
                    <PercentsCeil>{percentage.toFixed(2)}%</PercentsCeil>
                    <AllVotesCeil>
                        {formatDecimal(approval.toFixed(), 0)}
                        <span>M</span>
                    </AllVotesCeil>
                    <PostLinkCeil>{witness_thread}</PostLinkCeil>
                    <MissedCeil>{missed}</MissedCeil>
                    <LastBlockCeil>{lastBlock}</LastBlockCeil>
                    <FeedCeil>
                        <PriceFeedTokens>
                            <PriceFeedQuote>{priceFeed.get('quote')} / </PriceFeedQuote>
                            {priceFeed.get('base')}
                        </PriceFeedTokens>
                        <LastFeedTime>
                            <TimeAgoWrapper
                                date={lastUpdateFeed}
                                className={lastUpdateFeedClassName}
                            />
                        </LastFeedTime>
                    </FeedCeil>
                    <ToggleStringCeil>
                        <CloseOpenButton collapsed toggle={() => {}} />
                    </ToggleStringCeil>
                </WitnessString>
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
                            {witnesses.toArray()}
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
