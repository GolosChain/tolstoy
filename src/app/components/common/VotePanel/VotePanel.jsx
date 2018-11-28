import React from 'react';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import VotePanelAbstract from './VotePanelAbstract';

const LikeWrapper = styled.i`
    margin-left: -8px;
    padding: 8px;
    ${is('vertical')`
        margin: -8px 0 0 0;
    `};

    transition: transform 0.15s;
    &:hover {
        transform: scale(1.15);
    }
`;

const LikeCount = styled.span`
    ${({ vertical }) => (vertical ? `padding: 0 8px;` : `padding: 8px 0;`)};
    color: #959595;
    transition: color 0.15s;

    &:hover {
        color: #000000;
    }
`;

const LikeIcon = styled(Icon)`
    vertical-align: middle;
    width: 20px;
    height: 20px;
    margin-top: -5px;
    color: #393636;
    transition: color 0.2s;
`;

const LikeIconNeg = styled(LikeIcon)`
    margin-top: 0;
    margin-bottom: -5px;
    transform: scale(1, -1);
`;

const LikeBlock = styled.div`
    display: flex;
    align-items: center;

    cursor: pointer;
    user-select: none;
    white-space: nowrap;

    ${is('vertical')`
        flex-direction: column;
        margin: 0 !important;
        padding: 0 0 10px;
    `};

    ${is('last')`
        padding: 0;
    `};

    ${isNot('vertical')`
        &:hover,
        &:hover ${LikeIcon}, &:hover ${LikeIconNeg} {
            color: #000000;
        }
    `};

    ${is('active')`
        ${LikeIcon}, ${LikeCount} {
            color: #2879ff !important;
        }
    `};

    ${is('activeNeg')`
        ${LikeIconNeg}, ${LikeCount} {
            color: #ff4e00 !important;
        }
    `};
`;

const LikeBlockNeg = styled(LikeBlock)`
    margin-left: 5px;
`;

const Root = styled.div`
    position: relative;
    padding: 12px 18px;
    display: flex;
    align-items: center;

    ${is('vertical')`
        flex-direction: column;
    `};
`;

const IconTriangle = styled(Icon).attrs({
    name: 'triangle',
})`
    width: 5px;
    margin-top: 1px;
    margin-left: 2px;
    vertical-align: top;
    color: #393636;
    cursor: pointer;
    user-select: none;
`;

const Money = styled.div`
    display: flex;
    align-items: center;

    height: 26px;
    padding: 0 9px;
    margin: 0 10px;

    border: 1px solid #959595;
    border-radius: 100px;
    color: #959595;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;

    &:hover {
        border-color: #393636;
        color: #393636;
    }
`;

export default class VotePanel extends VotePanelAbstract {
    Money = Money;

    _render() {
        const { data, className, vertical, votesSummary } = this.props;
        const { showSlider, sliderAction } = this.state;

        if (!data) {
            return null;
        }

        const { likeTooltip, dislikeTooltip } = this.getVotesTooltips();

        return (
            <Root className={className} innerRef={this._onRef} vertical={vertical}>
                <LikeBlock
                    active={votesSummary.myVote === 'like' || sliderAction === 'like'}
                    vertical={vertical}
                >
                    <LikeWrapper
                        role="button"
                        data-tooltip={tt('g.like')}
                        aria-label={tt('g.like')}
                        innerRef={this.onLikeRef}
                        vertical={vertical}
                        onClick={this.onLikeClick}
                    >
                        <LikeIcon name="like" />
                    </LikeWrapper>
                    <LikeCount
                        data-tooltip={likeTooltip}
                        data-tooltip-html
                        role="button"
                        aria-label={tt('aria_label.likers_list', { count: votesSummary.likes })}
                        vertical={vertical}
                        onClick={votesSummary.likes === 0 ? null : this.onLikesNumberClick}
                    >
                        {votesSummary.likes}
                        {vertical ? null : <IconTriangle />}
                    </LikeCount>
                </LikeBlock>
                {vertical ? null : this.renderPayout()}
                <LikeBlockNeg
                    last
                    activeNeg={votesSummary.myVote === 'dislike' || sliderAction === 'dislike'}
                    vertical={vertical}
                >
                    <LikeWrapper
                        role="button"
                        data-tooltip={tt('g.dislike')}
                        aria-label={tt('g.dislike')}
                        innerRef={this.onDisLikeRef}
                        vertical={vertical}
                        onClick={this.onDislikeClick}
                    >
                        <LikeIconNeg name="like" />
                    </LikeWrapper>
                    <LikeCount
                        data-tooltip={dislikeTooltip}
                        data-tooltip-html
                        role="button"
                        aria-label={tt('aria_label.dislikers_list', {
                            count: votesSummary.dislikes,
                        })}
                        vertical={vertical}
                        onClick={votesSummary.dislikes === 0 ? null : this.onDislikesNumberClick}
                    >
                        {votesSummary.dislikes}
                        {vertical ? null : <IconTriangle />}
                    </LikeCount>
                </LikeBlockNeg>
                {showSlider ? this.renderSlider() : null}
            </Root>
        );
    }
}
