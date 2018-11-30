import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import is, { isNot } from 'styled-is';
import { Map } from 'immutable';

import { getStoreState } from 'app/clientRender';
import { listenLazy } from 'src/app/helpers/hoc';
import Icon from 'golos-ui/Icon';
import Slider from 'golos-ui/Slider';
import PostPayout from 'src/app/components/common/PostPayout';
import DislikeAlert from 'src/app/components/dialogs/DislikeAlert';
import DialogManager from 'app/components/elements/common/DialogManager';
import Popover from '../Popover';
import PayoutInfo from '../PayoutInfo';
import PayoutInfoDialog from '../PayoutInfoDialog';
import { confirmVote } from 'src/app/helpers/votes';

const VOTE_PERCENT_THRESHOLD = 1000000;
const MOBILE_WIDTH = 890;

const LIKE_PERCENT_KEY = 'golos.like-percent';
const DISLIKE_PERCENT_KEY = 'golos.dislike-percent';

const SLIDER_OFFSET = 8;

const OFFSET = -42;
const VERT_OFFSET_UP = -44;
const VERT_OFFSET_DOWN = 26;

const USERS_NUMBER_IN_TOOLTIP = 8;

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
    ${({ vertical }) => vertical ? `padding: 0 8px;` : `padding: 8px 0;`};
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

const OkIcon = styled(Icon)`
    width: 16px;
    margin-right: 13px;
    color: #a8a8a8;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
        color: #2879ff;
    }

    ${is('red')`
        &:hover {
            color: #ff4e00;
        }
    `};
`;

const CancelIcon = styled(Icon)`
    width: 12px;
    margin-left: 13px;
    color: #e1e1e1;
    transition: color 0.15s;
    cursor: pointer;

    &:hover {
        color: #333;
    }
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

const SliderBlock = styled.div`
    position: absolute;
    display: flex;
    height: 40px;
    top: 0;
    left: 0;
    width: 100%;
    min-width: 220px;
    padding: 0 14px;
    margin: 0 -${SLIDER_OFFSET}px;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    background: #fff;
    animation: from-down 0.2s;
`;

const SliderBlockTip = styled.div`
    position: absolute;
    bottom: 0;
    left: ${a => a.left || '50%'};
    margin-left: -5px;
    margin-bottom: -5px;
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    background: #fff;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.1);
`;

const SliderStyled = styled(Slider)`
    flex-grow: 1;
    flex-shrink: 1;
`;

const PostPayoutStyled = styled(PostPayout)`
    user-select: none;
`;

@listenLazy('resize')
export default class VotePanel extends PureComponent {
    static propTypes = {
        data: PropTypes.instanceOf(Map),
        username: PropTypes.string,
        vertical: PropTypes.bool,
    };

    state = {
        sliderAction: null,
        showSlider: false,
        votePercent: 0,
        isMobile: this.isMobile(),
    };

    componentWillUnmount() {
        window.removeEventListener('click', this.onAwayClick);
        window.removeEventListener('touchstart', this.onAwayClick);
    }

    onLikesNumberClick = () => {
        const { contentLink } = this.props;

        this.props.openVotersDialog(contentLink, 'likes');
    };

    onDislikesNumberClick = () => {
        const { contentLink } = this.props;

        this.props.openVotersDialog(contentLink, 'dislikes');
    };

    render() {
        const { data, className, vertical, votesSummary } = this.props;
        const { showSlider, sliderAction } = this.state;

        if (!data) {
            return null;
        }

        const likersList = showSlider
            ? null
            : makeTooltip(
                  usersListForTooltip(votesSummary.firstLikes),
                  votesSummary.likes > USERS_NUMBER_IN_TOOLTIP
              );

        const dislikersList = showSlider
            ? null
            : makeTooltip(
                  usersListForTooltip(votesSummary.firstDislikes),
                  votesSummary.dislikes > USERS_NUMBER_IN_TOOLTIP
              );
        return (
            <Root className={className} innerRef={this.onRef} vertical={vertical}>
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
                        data-tooltip={likersList}
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
                        data-tooltip={dislikersList}
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

    renderSlider() {
        const { vertical } = this.props;
        const { sliderAction, votePercent } = this.state;

        const like = sliderAction === 'like' ? this._like : this._disLike;

        const box = this.root.getBoundingClientRect();
        const likeBox = like.getBoundingClientRect();

        const tipLeft = SLIDER_OFFSET + (likeBox.left - box.left + likeBox.width / 2);

        let verticalOffset = OFFSET;

        if (vertical) {
            if (sliderAction === 'like') {
                verticalOffset = VERT_OFFSET_UP;
            } else {
                verticalOffset = VERT_OFFSET_DOWN;
            }
        }

        return (
            <SliderBlock style={{ top: verticalOffset }}>
                <SliderBlockTip left={`${tipLeft}px`} />
                <OkIcon
                    name="check"
                    red={sliderAction === 'dislike' ? 1 : 0}
                    data-tooltip={tt('g.vote')}
                    aria-label={tt('g.vote')}
                    onClick={this.onOkVoteClick}
                />
                <SliderStyled
                    value={votePercent}
                    red={sliderAction === 'dislike'}
                    onChange={this.onPercentChange}
                />
                <CancelIcon
                    name="cross"
                    data-tooltip={tt('g.cancel')}
                    aria-label={tt('g.cancel')}
                    onClick={this._onCancelVoteClick}
                />
            </SliderBlock>
        );
    }

    getPayoutInfoComponent = () => {
        const { data } = this.props;

        return <PayoutInfo postLink={data.get('author') + '/' + data.get('permlink')} />;
    };

    renderPayout() {
        const { data } = this.props;
        const { isMobile } = this.state;
        const postLink = data.get('author') + '/' + data.get('permlink');

        if (isMobile) {
            return (
                <Money onClick={this._onPayoutClick} aria-label={tt('aria_label.expected_payout')}>
                    <PostPayoutStyled postLink={postLink} />
                </Money>
            );
        } else {
            return (
                <Popover content={this.getPayoutInfoComponent}>
                    <Money>
                        <PostPayoutStyled postLink={postLink} />
                    </Money>
                </Popover>
            );
        }
    }

    isMobile() {
        return process.env.BROWSER ? window.innerWidth < MOBILE_WIDTH : false;
    }

    hideSlider() {
        this.setState({
            showSlider: false,
            sliderAction: null,
        });

        window.removeEventListener('click', this.onAwayClick);
        window.removeEventListener('touchstart', this.onAwayClick);
    }

    onRef = el => {
        this.root = el;
    };

    onLikeRef = el => {
        this._like = el;
    };

    onDisLikeRef = el => {
        this._disLike = el;
    };

    onLikeClick = this.loginProtection(() => {
        const { votesSummary } = this.props;

        if (this.state.showSlider) {
            this.hideSlider();
        } else if (votesSummary.myVote === 'like') {
            this.onChange(0);
        } else if (isNeedShowSlider()) {
            this.setState({
                votePercent: getSavedPercent(LIKE_PERCENT_KEY),
                sliderAction: 'like',
                showSlider: true,
            });

            window.addEventListener('click', this.onAwayClick);
            window.addEventListener('touchstart', this.onAwayClick);
        } else {
            this.onChange(1);
        }
    });

    onDislikeClick = this.loginProtection(async () => {
        const { votesSummary } = this.props;

        if (this.state.showSlider) {
            this.hideSlider();
        } else if (votesSummary.myVote === 'dislike') {
            this.onChange(0);
        } else if (isNeedShowSlider()) {
            this.setState({
                votePercent: getSavedPercent(DISLIKE_PERCENT_KEY),
                sliderAction: 'dislike',
                showSlider: true,
            });

            window.addEventListener('click', this.onAwayClick);
            window.addEventListener('touchstart', this.onAwayClick);
        } else {
            if (await this.showDislikeAlert()) {
                this.onChange(-1);
            }
        }
    });

    async onChange(percent) {
        const { username, data, myVote } = this.props;

        if (await confirmVote(myVote, percent)) {
            this.props.onVote(username, data.get('author'), data.get('permlink'), percent);
        }
    }

    showDislikeAlert() {
        return new Promise(resolve => {
            DialogManager.showDialog({
                component: DislikeAlert,
                onClose(yes) {
                    resolve(yes);
                },
            });
        });
    }

    onAwayClick = e => {
        if (this.root && !this.root.contains(e.target)) {
            this.hideSlider();
        }
    };

    onPercentChange = percent => {
        this.setState({
            votePercent: percent,
        });
    };

    onOkVoteClick = async () => {
        const { sliderAction, votePercent } = this.state;

        if (sliderAction === 'dislike') {
            if (!(await this.showDislikeAlert())) {
                return;
            }
        }

        const multiplier = sliderAction === 'like' ? 1 : -1;
        this.onChange(multiplier * (votePercent / 100));
        savePercent(sliderAction === 'like' ? LIKE_PERCENT_KEY : DISLIKE_PERCENT_KEY, votePercent);

        this.hideSlider();
    };

    _onCancelVoteClick = () => {
        this.hideSlider();
    };

    _onPayoutClick = () => {
        const { data } = this.props;

        DialogManager.showDialog({
            component: PayoutInfoDialog,
            props: {
                postLink: data.get('author') + '/' + data.get('permlink'),
            },
        });
    };

    // Not unused
    // Calling from @listenLazy('resize')
    onResize = () => {
        this.setState({
            isMobile: this.isMobile(),
        });
    };

    loginProtection(func) {
        return (...args) => {
            this.props.loginIfNeed(logged => {
                if (logged) {
                    func(...args);
                }
            });
        };
    }
}

function makeTooltip(accounts, isMore) {
    return accounts.join('<br>') + (isMore ? '<br>...' : '');
}

function usersListForTooltip(usersList) {
    if (usersList.length > USERS_NUMBER_IN_TOOLTIP) {
        usersList = usersList.slice(0, USERS_NUMBER_IN_TOOLTIP);
    }
    return usersList;
}

function isNeedShowSlider() {
    const state = getStoreState();

    const current = state.user.get('current');

    if (!current) {
        return false;
    }

    const netVesting =
        current.get('vesting_shares') -
        current.get('delegated_vesting_shares') +
        current.get('received_vesting_shares');

    return netVesting > VOTE_PERCENT_THRESHOLD;
}

function getSavedPercent(key) {
    try {
        const percent = JSON.parse(localStorage.getItem(key));

        if (Number.isFinite(percent)) {
            return percent;
        }
    } catch (err) {}

    return 100;
}

function savePercent(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {}
}
