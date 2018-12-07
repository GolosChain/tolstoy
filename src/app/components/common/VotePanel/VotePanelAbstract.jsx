import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';
import { Map } from 'immutable';
import throttle from 'lodash/throttle';

import Icon from 'golos-ui/Icon';
import Slider from 'golos-ui/Slider';
import PostPayout from 'src/app/components/common/PostPayout';
import DislikeAlert from 'src/app/components/dialogs/DislikeAlert';
import DialogManager from 'app/components/elements/common/DialogManager';
import Popover from '../Popover';
import PayoutInfo from '../PayoutInfo';
import PayoutInfoDialog from '../PayoutInfoDialog';
import { confirmVote } from 'src/app/helpers/votes';

import {
    USERS_NUMBER_IN_TOOLTIP,
    getSavedPercent,
    savePercent,
    makeTooltip,
    usersListForTooltip,
} from './helpers';

const MOBILE_WIDTH = 890;

const LIKE_PERCENT_KEY = 'golos.like-percent';
const DISLIKE_PERCENT_KEY = 'golos.dislike-percent';

export const SLIDER_OFFSET = 8;

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
    white-space: nowrap;
    user-select: none;
`;

const Money = styled.div``;

export default class VotePanelAbstract extends PureComponent {
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

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        this.onResize.cancel();
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('click', this.onAwayClick);
        window.removeEventListener('touchstart', this.onAwayClick);
    }

    getMoneyComponent() {
        return Money;
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
        if (!this.props.data) {
            return null;
        }

        return this.renderInner();
    }

    renderInner() {
        throw new Error('Abstract method call');
    }

    calcTipLeft() {
        return 0;
    }

    callVerticalOffset() {
        return 0;
    }

    renderSlider() {
        const { sliderAction, votePercent } = this.state;

        const tipLeft = this.calcTipLeft();
        const verticalOffset = this.callVerticalOffset();

        return (
            <SliderBlock style={{ top: verticalOffset }}>
                <SliderBlockTip left={`${tipLeft}px`} />
                <OkIcon
                    name="check"
                    red={sliderAction === 'dislike' ? 1 : 0}
                    data-tooltip={tt('g.vote')}
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
                    onClick={this.onCancelVoteClick}
                />
            </SliderBlock>
        );
    }

    getPayoutInfoComponent = () => {
        const { data } = this.props;

        return <PayoutInfo postLink={data.get('author') + '/' + data.get('permlink')} />;
    };

    getVotesTooltips() {
        const { votesSummary } = this.props;
        const { showSlider } = this.state;

        if (showSlider) {
            return {};
        }

        return {
            likeTooltip: makeTooltip(
                usersListForTooltip(votesSummary.firstLikes),
                votesSummary.likes > USERS_NUMBER_IN_TOOLTIP
            ),
            dislikeTooltip: makeTooltip(
                usersListForTooltip(votesSummary.firstDislikes),
                votesSummary.dislikes > USERS_NUMBER_IN_TOOLTIP
            ),
        };
    }

    renderPayout(add) {
        const { data } = this.props;
        const { isMobile } = this.state;
        const postLink = data.get('author') + '/' + data.get('permlink');

        const Money = this.getMoneyComponent();

        if (isMobile) {
            return (
                <Money onClick={this.onPayoutClick} aria-label={tt('aria_label.expected_payout')}>
                    <PostPayoutStyled postLink={postLink} />
                    {add}
                </Money>
            );
        } else {
            return (
                <Popover content={this.getPayoutInfoComponent}>
                    <Money>
                        <PostPayoutStyled postLink={postLink} />
                        {add}
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

    rootRef = createRef();
    likeRef = createRef();
    dislikeRef = createRef();

    onLikeClick = this.loginProtection(() => {
        const { votesSummary, isRich, defaultVotePower } = this.props;
        console.log(defaultVotePower);

        if (this.state.showSlider) {
            this.hideSlider();
        } else if (votesSummary.myVote === 'like') {
            this.onChange(0);
        } else if (isRich) {
            this.onChange(defaultVotePower);
        } else {
            this.onChange(1);
        }
    });

    onDislikeClick = this.loginProtection(async () => {
        const { votesSummary, isRich } = this.props;

        if (this.state.showSlider) {
            this.hideSlider();
        } else if (votesSummary.myVote === 'dislike') {
            this.onChange(0);
        } else if (isRich) {
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
        if (this.rootRef.current && !this.rootRef.current.contains(e.target)) {
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

    onCancelVoteClick = () => {
        this.hideSlider();
    };

    onPayoutClick = () => {
        const { data } = this.props;

        DialogManager.showDialog({
            component: PayoutInfoDialog,
            props: {
                postLink: data.get('author') + '/' + data.get('permlink'),
            },
        });
    };

    onResize = throttle(() => {
        this.setState({
            isMobile: this.isMobile(),
        });
    }, 100);

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
