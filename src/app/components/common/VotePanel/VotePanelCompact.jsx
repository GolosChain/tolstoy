import React, { Fragment } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import VotePanelAbstract from './VotePanelAbstract';

const UpVoteContainer = styled.div`
    position: relative;
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

    &:hover {
        color: #2879ff;
    }
`;

const UpVoteIcon = styled(Icon)`
    width: 20px;
    height: 20px;

    @media (max-width: 500px) {
        width: 16px;
        height: 16px;
    }
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

    @media (max-width: 500px) {
        font-size: 12px;
    }

    @media (max-width: 370px) {
        padding-left: 0;
    }
`;

const IconTriangle = styled(Icon).attrs({
    name: 'triangle',
})`
    flex-shrink: 0;
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

    @media (max-width: 500px) {
        width: 8px;
    }
`;

const LikesCount = styled.div`
    font-size: 14px;
    font-weight: 500;

    @media (max-width: 500px) {
        font-size: 12px;
    }
`;

export default class VotePanelCompact extends VotePanelAbstract {
    getMoneyComponent() {
        return Money;
    }

    calcTipLeft() {
        return 22;
    }

    callVerticalOffset() {
        return -49;
    }

    renderInner() {
        const { votesSummary } = this.props;
        const { sliderAction, showSlider } = this.state;

        const { likeTooltip } = this.getVotesTooltips();

        return (
            <Fragment>
                <UpVoteContainer ref={this.rootRef}>
                    <UpVoteBlock
                        role="button"
                        data-tooltip={tt('g.like')}
                        aria-label={tt('g.like')}
                        onClick={this.onLikeClick}
                    >
                        <UpVoteIcon
                            name={
                                votesSummary.myVote === 'like' || sliderAction === 'like'
                                    ? 'upvote_filled'
                                    : 'upvote'
                            }
                        />
                    </UpVoteBlock>
                    {showSlider ? this.renderSlider() : null}
                </UpVoteContainer>
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
            </Fragment>
        );
    }
}
