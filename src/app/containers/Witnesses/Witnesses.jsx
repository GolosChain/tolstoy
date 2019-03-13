import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ByteBuffer from 'bytebuffer';
import { is } from 'immutable';
import tt from 'counterpart';

import {
  witnessPageDesktopPoint,
  witnessPageDesktopPointStrTemplate,
  witnessPagePadPoint,
  witnessPagePadPointStrTemplate,
  stringTemplate,
  witnessPageMobilePoint,
  witnessPageMobilePointStrTemplate,
} from 'src/app/containers/Witnesses/WitnessesStrings/WitnessesString';
import WitnessesStrings from 'src/app/containers/Witnesses/WitnessesStrings/WitnessesStrings';
import VoteForAnyWitness from 'src/app/containers/Witnesses/VoteForAnyWitness';

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

  @media (max-width: ${witnessPageDesktopPoint}px) {
    max-width: 750px;
  }
  @media (max-width: ${witnessPagePadPoint}px) {
    max-width: 500px;
  }
  @media (max-width: ${witnessPageMobilePoint}px) {
    max-width: 320px;
  }
`;

const Header = styled.div`
  padding-top: 30px;

  @media (max-width: ${witnessPageMobilePoint}px) {
    padding: 30px 16px 0 16px;
  }
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
  @media (max-width: ${witnessPageMobilePoint}px) {
    display: none;
  }
`;

const InfoHeadItem = styled(TableHeadItem)`
  @media (max-width: ${witnessPageDesktopPoint}px) {
    display: none;
  }
`;

const MissedBlocksHeadItem = styled(TableHeadItem)`
  @media (max-width: ${witnessPagePadPoint}px) {
    display: none;
  }
`;

const LastBlockHeadItem = styled(TableHeadItem)`
  @media (max-width: ${witnessPagePadPoint}px) {
    display: none;
  }
`;

const PriceFeedHeadItem = styled(TableHeadItem)`
  @media (max-width: ${witnessPageDesktopPoint}px) {
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

export class Witnesses extends Component {
  static propTypes = {
    witnesses: PropTypes.object.isRequired,
    accountWitnessVote: PropTypes.func.isRequired,
    loginIfNeed: PropTypes.func.isRequired,
    username: PropTypes.string,
    witnessVotes: PropTypes.object,
  };

  state = {
    proxy: '',
    proxyFailed: false,
  };

  shouldComponentUpdate(np, ns) {
    const { witnessVotes, witnesses, currentProxy, username } = this.props;
    const { proxy, proxyFailed } = this.state;

    return (
      !is(np.witnessVotes, witnessVotes) ||
      np.witnesses !== witnesses ||
      np.currentProxy !== currentProxy ||
      np.username !== username ||
      ns.proxy !== proxy ||
      ns.proxyFailed !== proxyFailed
    );
  }

  accountWitnessVote = (accountName, approve) => {
    const { loginIfNeed, username, accountWitnessVote } = this.props;

    loginIfNeed(logged => {
      if (logged) {
        accountWitnessVote(username, accountName, approve);
      }
    });
  };

  render() {
    const { witnessVotes, currentProxy, totalVestingShares, witnesses } = this.props;

    const sorted_witnesses = witnesses.sort((a, b) =>
      Long.fromString(String(b.get('votes'))).subtract(
        Long.fromString(String(a.get('votes'))).toString()
      )
    );
    let witness_vote_count = 30;

    if (witnessVotes) {
      witness_vote_count -= witnessVotes.size;
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
                <InfoHeadItem>{tt('witnesses_jsx.information')}</InfoHeadItem>
                <MissedBlocksHeadItem>
                  <div>{tt('witnesses_jsx.missed_1')}</div>
                  <div>{tt('witnesses_jsx.missed_2')}</div>
                </MissedBlocksHeadItem>
                <LastBlockHeadItem>
                  <div>{tt('witnesses_jsx.last_block1')}</div>
                  <div>{tt('witnesses_jsx.last_block2')}</div>
                </LastBlockHeadItem>
                <PriceFeedHeadItem>{tt('witnesses_jsx.price_feed')}</PriceFeedHeadItem>
                <VotesHeadItem>{tt('witnesses_jsx.version')}</VotesHeadItem>
                <TableHeadItem />
              </TableHead>
              <WitnessesStrings
                sortedWitnesses={sorted_witnesses}
                witnessVotes={witnessVotes}
                totalVestingShares={totalVestingShares}
                accountWitnessVote={this.accountWitnessVote}
              />
            </TableWrapper>
          )}
          {currentProxy && currentProxy.length ? null : (
            <VoteForAnyWitness
              witnessVotes={witnessVotes}
              accountWitnessVote={this.accountWitnessVote}
            />
          )}
        </Wrapper>
      </WrapperForBackground>
    );
  }
}
