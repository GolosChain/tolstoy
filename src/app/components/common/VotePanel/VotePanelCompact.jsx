import React from 'react';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import VotePanelAbstract from './VotePanelAbstract';

const Root = styled.div`
    display: flex;
    align-items: center;
`;

const UpVoteBlock = styled.div`
    display: flex;
    align-items: center;
    height: 24px;
    padding-left: 4px;
    padding-right: 5px;
    margin-left: -4px;
    color: #333;
    transition: color 0.15s;
    cursor: pointer;

    ${is('active')`
        color: #2879ff;
    `};

    &:hover {
        color: #2879ff;
    }
`;

const UpVoteIcon = styled(Icon).attrs({ name: 'upvote' })`
    width: 20px;
    height: 20px;
`;

const Money = styled.div`
    display: flex;
    align-items: center;
    padding-left: 5px;
    padding-right: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #959595;
    user-select: none;
    cursor: pointer;
`;

const IconTriangle = styled(Icon).attrs({
    name: 'triangle',
})`
    width: 5px;
    margin-left: 6px;
    vertical-align: top;
    color: #959595;
`;

const LikesCountBlock = styled.div`
    display: flex;
    align-items: center;
    padding: 0 10px;
    color: #959595;
    user-select: none;
    cursor: pointer;
`;

const ChevronIcon = styled(Icon).attrs({ name: 'chevron' })`
    width: 10px;
    margin-right: 10px;
`;

const LikesCount = styled.div`
    font-size: 14px;
    font-weight: 500;
`;

export default class VotePanelCompact extends VotePanelAbstract {
    Money = Money;

    _render() {
        const { votesSummary } = this.props;
        const { sliderAction } = this.state;

        const { likeTooltip } = this.getVotesTooltips();

        return (
            <Root>
                <UpVoteBlock
                    role="button"
                    data-tooltip={tt('g.like')}
                    aria-label={tt('g.like')}
                    active={votesSummary.myVote === 'like' || sliderAction === 'like' ? 1 : 0}
                    onClick={this.onLikeClick}
                >
                    <UpVoteIcon />
                </UpVoteBlock>
                {this.renderPayout(<IconTriangle />)}
                <this.props.splitter />
                <LikesCountBlock
                    data-tooltip={likeTooltip}
                    data-tooltip-html
                    aria-label={tt('aria_label.likers_list', { count: votesSummary.likes })}
                    role="button"
                    onClick={votesSummary.likes === 0 ? null : this.onLikesNumberClick}
                >
                    <ChevronIcon />
                    <LikesCount>{votesSummary.likes}</LikesCount>
                </LikesCountBlock>
            </Root>
        );
    }
}
