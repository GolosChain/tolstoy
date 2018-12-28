import React, { Component, Fragment } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import Icon from 'golos-ui/Icon/index';
import links from 'app/utils/Links';
import { formatDecimal } from 'app/utils/ParsersAndFormatters';
import CloseOpenButton from 'src/app/components/cards/CloseOpenButton/index';

export const stringTemplate = '170px 70px 90px 115px 160px 120px 140px 225px 60px';
export const firstBreakPoint = 1180;
export const firstBreakPointStrTemplate = '165px 70px 90px 115px 120px 130px 60px';
export const secondBreakPoint = 767;
export const secondBreakPointStrTemplate = '165px 70px 90px 115px 60px';
export const thirdBreakPoint = 530;
export const thirdBreakPointStrTemplate = '140px 50px 80px 50px';

const ellipsisStyles = `
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
    background-color: #f6f6f6;
    border-bottom: 1px solid #e1e1e1;
    transition: 0.25s background-color ease;

    & ${WitnessInfoCeil}:last-child {
        justify-self: end;
        padding-right: 16px;
    }
    
    ${is('collapsed')`
        background-color: #ffffff;
    `};
    
    ${is('notActiveWitness')`
        opacity: 0.4;
    `}

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

    ${is('upvoted')`
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

const FullInfo = styled.div`
    display: flex;
    align-items: center;
    height: 370px;
    padding: 0 16px;
    background-color: #f6f6f6;
    border-bottom: 1px solid #e1e1e1;
    overflow: hidden;
    transition: 0.25s height ease, 0.25s background-color ease;

    ${is('collapsed')`
        height: 0;
        background-color: #ffffff;
    `};
`;

const InfoBlock = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const InfoBlocksDivider = styled.div`
    width: 1px;
    height: calc(100% - 4px);
    background-color: #e6e6e6;
`;

const InfoString = styled.div``;

export default class WitnessesString extends Component {
    state = {
        stringCollapsed: true,
    };

    toggleString = () => {
        this.setState({ stringCollapsed: !this.state.stringCollapsed });
    };

    render() {
        const { rank, item, witnessVotes, totalVestingShares } = this.props;
        const { stringCollapsed } = this.state;

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

        const oneM = Math.pow(10, 6);
        const approval = votes / oneM / oneM;
        const percentage = 100 * (votes / oneM / totalVestingShares.split(' ')[0]);

        const lastFeedDate = new Date(lastUpdateFeed).getTime();
        const isOneDayAgo = lastFeedDate < new Date().setDate(new Date().getDate() - 1);
        const isOneWeekAgo = lastFeedDate < new Date().setDate(new Date().getDate() - 7);

        const isWitnessesDeactivate = /GLS1111111111111111111111111111111114T1Anm/.test(signingKey);
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
            <Fragment>
                <WitnessString
                    key={owner}
                    notActiveWitness={isWitnessesDeactivate || noPriceFeed ? 1 : 0}
                    title={
                        isWitnessesDeactivate
                            ? tt('witnesses_jsx.witness_deactive')
                            : noPriceFeed
                            ? tt('witnesses_jsx.no_price_feed')
                            : null
                    }
                    collapsed={stringCollapsed}
                >
                    <WitnessNumberAndName>
                        <div>{rank}</div>
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
                        <CloseOpenButton collapsed={stringCollapsed} toggle={this.toggleString} />
                    </ToggleStringCeil>
                </WitnessString>
                <FullInfo collapsed={stringCollapsed}>
                    <InfoBlock>
                        <InfoString>{tt('witnesses_jsx.approval')}:</InfoString>
                        <InfoBlock>{tt('witnesses_jsx.information')}:</InfoBlock>
                        <InfoBlock>{`${tt('witnesses_jsx.missed_1')} ${tt(
                            'witnesses_jsx.missed_2'
                        )}:`}</InfoBlock>
                        <InfoBlock>{`${tt('witnesses_jsx.last_block1')} ${tt(
                            'witnesses_jsx.last_block2'
                        )}:`}</InfoBlock>
                        <InfoBlock>{tt('witnesses_jsx.price_feed')}:</InfoBlock>
                    </InfoBlock>
                    <InfoBlocksDivider />
                    <InfoBlock>test</InfoBlock>
                    <InfoBlocksDivider />
                    <InfoBlock>test</InfoBlock>
                </FullInfo>
            </Fragment>
        );
    }
}
