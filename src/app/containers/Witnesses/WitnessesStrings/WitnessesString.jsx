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

export const stringTemplate = '170px 70px 90px 160px 120px 140px 225px 115px 60px';
export const witnessPageDesktopPoint = 1180;
export const witnessPageDesktopPointStrTemplate = '165px 70px 90px 120px 130px 115px 60px';
export const witnessPagePadPoint = 767;
export const witnessPagePadPointStrTemplate = '165px 70px 90px 115px 60px';
export const witnessPageMobilePoint = 530;
export const witnessPageMobilePointStrTemplate = '140px 50px 80px 50px';

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

    @media (max-width: ${witnessPageMobilePoint}px) {
        display: none;
    }
`;

const FeedCeil = styled(WitnessInfoCeil)`
    font-family: 'Open Sans', sans-serif;
    line-height: 1.4;

    @media (max-width: ${witnessPageDesktopPoint}px) {
        display: none;
    }
`;

const PostLink = styled(({ to, href, children, ...props }) =>
    to ? (
        <Link to={to} {...props}>
            {children}
        </Link>
    ) : (
        <a href={href} {...props}>
            {children}
        </a>
    )
)`
    position: relative;
    text-transform: capitalize;
    color: #2879ff;

    &:focus {
        color: #2879ff;
    }
    &:hover {
        color: #2879ff;
        text-decoration: underline;
    }

    & ${Icon} {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 8px;
        color: #2879ff;
    }
`;

const PostLinkCeil = styled(WitnessInfoCeil)`
    @media (max-width: ${witnessPageDesktopPoint}px) {
        display: none;
    }
`;

const MissedCeil = styled(WitnessInfoCeil)`
    ${ellipsisStyles};

    @media (max-width: ${witnessPagePadPoint}px) {
        display: none;
    }
`;

const LastBlockCeil = styled(WitnessInfoCeil)`
    ${ellipsisStyles};

    @media (max-width: ${witnessPagePadPoint}px) {
        display: none;
    }
`;

const ToggleStringCeil = styled(WitnessInfoCeil)`
    justify-self: center;
    padding-left: 0;
`;

const LittleM = styled.span`
    font-size: 10px;
    color: #959595;
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
    `};

    @media (max-width: ${witnessPageDesktopPoint}px) {
        grid-template-columns: ${witnessPageDesktopPointStrTemplate};
    }
    @media (max-width: ${witnessPagePadPoint}px) {
        grid-template-columns: ${witnessPagePadPointStrTemplate};
    }
    @media (max-width: ${witnessPageMobilePoint}px) {
        grid-template-columns: ${witnessPageMobilePointStrTemplate};
    }
`;

const VoteButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background-color: #ffffff;
    border: 1px solid rgba(57, 54, 54, 0.3);
    border-radius: 50%;
    cursor: pointer;

    &:hover {
        ${({ upvoted }) =>
            upvoted ? 'background-color: #0e69ff' : 'border: 1px solid rgba(57, 54, 54, 0.6)'};
    }

    ${is('upvoted')`
        background-color: #2879ff;
        border: 0;
    `};

    & svg {
        color: #${({ upvoted }) => (upvoted ? 'ffffff' : '393636')};
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
    ${ellipsisStyles};
`;

const InfoString = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    color: #393636;

    & ${LastFeedTime} {
        margin-top: 3px;
    }
    & ${LittleM} {
        margin-top: 4px;
    }
`;

const InfoStringSpan = styled.span`
    font-weight: bold;
`;

const FullInfoDivider = styled.div`
    position: absolute;
    width: 1px;
    height: calc(100% - 4px);
    background-color: #e1e1e1;
`;

const FullInfoFirstDivider = styled(FullInfoDivider)`
    left: 382px;

    @media (max-width: ${witnessPageDesktopPoint}px) {
        left: 374px;
    }
    @media (max-width: ${witnessPagePadPoint}px) {
        display: none;
    }
`;

const FullInfoSecondDivider = styled(FullInfoDivider)`
    right: 382px;

    @media (max-width: ${witnessPageDesktopPoint}px) {
        display: none;
    }
`;

const FullInfo = styled.div`
    position: relative;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: repeat(11, 1fr);

    height: 370px;
    border-bottom: 1px solid #e1e1e1;
    background-color: #f6f6f6;
    overflow: hidden;
    transition: 0.25s background-color ease;

    & ${InfoString} {
        margin: 0 16px;
        align-self: center;
    }

    ${is('collapsed')`
        height: 0 !important;
        border-bottom: 0 !important;
        background-color: #ffffff !important;
    `};

    @media (max-width: ${witnessPageDesktopPoint}px) {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(16, 1fr);
        height: 575px;
    }

    @media (max-width: ${witnessPagePadPoint}px) {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(31, 1fr);
        height: 1000px;
    }
`;

export default class WitnessesString extends Component {
    state = {
        stringCollapsed: true,
    };

    toggleString = () => {
        this.setState({ stringCollapsed: !this.state.stringCollapsed });
    };

    render() {
        const { rank, item, witnessVotes, totalVestingShares, accountWitnessVote } = this.props;
        const { stringCollapsed } = this.state;

        const owner = item.get('owner');
        const thread = item.get('url');
        const votes = item.get('votes');
        const missed = item.get('total_missed');
        const lastBlock = item.get('last_confirmed_block_num');
        const lastUpdateFeed = item.get('last_sbd_exchange_update');
        const priceFeed = item.get('sbd_exchange_rate');
        const signingKey = item.get('signing_key');
        const props = item.get('props');
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
                witness_thread = (
                    <PostLink to={thread}>{tt('witnesses_jsx.witness_thread')}</PostLink>
                );
            } else {
                witness_thread = (
                    <PostLink href={thread}>
                        {tt('witnesses_jsx.witness_thread')}
                        <Icon name="external-link" size="13" />
                    </PostLink>
                );
            }
        }

        const votesBlock = (
            <Fragment>
                {formatDecimal(approval.toFixed(), 0)}
                <LittleM>M</LittleM>
            </Fragment>
        );

        return (
            <Fragment>
                <WitnessString
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
                            onClick={() => accountWitnessVote(owner, !myVote)}
                            title={tt(
                                myVote
                                    ? 'witnesses_jsx.remove_vote_from_witness_node'
                                    : 'witnesses_jsx.vote_for_witness'
                            )}
                            upvoted={myVote ? 1 : 0}
                        >
                            <Icon
                                name={myVote ? 'white-oppos-witness' : 'witness-logo'}
                                size="16"
                            />
                        </VoteButton>
                    </VoteButtonCeil>
                    <PercentsCeil>{percentage.toFixed(2)}%</PercentsCeil>
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
                    <AllVotesCeil>{item.get('running_version')}</AllVotesCeil>
                    <ToggleStringCeil>
                        <CloseOpenButton collapsed={stringCollapsed} toggle={this.toggleString} />
                    </ToggleStringCeil>
                </WitnessString>
                <FullInfo collapsed={stringCollapsed}>
                    <FullInfoFirstDivider />
                    <FullInfoSecondDivider />
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.approval')}
                            :&nbsp;
                        </InfoStringSpan>
                        {votesBlock}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.information')}
                            :&nbsp;
                        </InfoStringSpan>
                        {witness_thread}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.missed_1')} {tt('witnesses_jsx.missed_2')}
                            :&nbsp;
                        </InfoStringSpan>
                        {missed}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.last_block1')} {tt('witnesses_jsx.last_block2')}
                            :&nbsp;
                        </InfoStringSpan>
                        {lastBlock}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.price_feed')}
                            :&nbsp;
                        </InfoStringSpan>
                        <PriceFeedQuote>
                            {priceFeed.get('quote')}
                            &nbsp;
                        </PriceFeedQuote>
                        {priceFeed.get('base')}
                        &nbsp;
                        <LastFeedTime>
                            <TimeAgoWrapper
                                date={lastUpdateFeed}
                                className={lastUpdateFeedClassName}
                            />
                        </LastFeedTime>
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.props')}
                            :&nbsp;
                        </InfoStringSpan>
                        {props.get('account_creation_fee')} /&nbsp;
                        {props.get('sbd_interest_rate') / 100}% /&nbsp;
                        {props.get('maximum_block_size')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.version')}
                            :&nbsp;
                        </InfoStringSpan>
                        {item.get('running_version')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.account_creation_fee')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('account_creation_fee')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.maximum_block_size')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('maximum_block_size')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.sbg_interest_rate')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('sbd_interest_rate') / 100}%
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.auction_window_size')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('auction_window_size')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.create_account_min_golos_fee')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('create_account_min_golos_fee')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.create_account_min_delegation')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('create_account_min_delegation')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.create_account_delegation_time')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('create_account_delegation_time') / 1000 / 60}
                        &nbsp;min
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>{tt('witnesses_jsx.min_delegation')}:&nbsp;</InfoStringSpan>
                        {props.get('min_delegation')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.max_referral_interest_rate')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('max_referral_interest_rate')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.max_referral_term_sec')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('max_referral_term_sec')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.min_referral_break_fee')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('min_referral_break_fee')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.max_referral_break_fee')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('max_referral_break_fee')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>{tt('witnesses_jsx.posts_window')}:&nbsp;</InfoStringSpan>
                        {props.get('posts_window')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.comments_window')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('comments_window')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.comments_per_window')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('comments_per_window')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>{tt('witnesses_jsx.votes_window')}:&nbsp;</InfoStringSpan>
                        {props.get('votes_window')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.votes_per_window')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('votes_per_window')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.max_delegated_vesting_interest_rate')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('max_delegated_vesting_interest_rate')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.custom_ops_bandwidth_multiplier')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('custom_ops_bandwidth_multiplier')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.min_curation_percent')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('min_curation_percent') / 100}%
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.max_curation_percent')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('max_curation_percent') / 100}%
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.curation_reward_curve')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('curation_reward_curve')}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.allow_distribute_auction_reward')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('allow_distribute_auction_reward') ? 'yes' : 'no'}
                    </InfoString>
                    <InfoString>
                        <InfoStringSpan>
                            {tt('witnesses_jsx.allow_return_auction_reward_to_fund')}:&nbsp;
                        </InfoStringSpan>
                        {props.get('allow_return_auction_reward_to_fund') ? 'yes' : 'no'}
                    </InfoString>
                </FullInfo>
            </Fragment>
        );
    }
}
