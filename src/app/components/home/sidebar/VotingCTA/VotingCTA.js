import React, { PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';
import moment from 'moment';
import is from 'styled-is';
import { Link } from 'react-router';
import tt from 'counterpart';

import Icon from 'src/app/components/golos-ui/Icon';
import VotingButtons from '../VotingButtons';

export const VOTING_TIME_START = new Date('2019-04-12T06:07:00.000Z');
export const VOTING_TIME_END = new Date('2019-04-21T06:07:00.000Z');

const TICK_EVERY = 10000;

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const VOTING_KEY = 'gls.votingCollapsed';

const VOTING_POST = '/cyberway/@goloscore/tranzit-na-cyberway-golosovanie';

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    ${is('collapsed')`
        flex-direction: row;
        padding-right: 40px
    `};
`;

const CollapseButton = styled.button.attrs({ type: 'button' })`
    position: absolute;
    flex-shrink: 0;
    padding: 12px;
    color: #ddd;
    top: 4px;
    right: 4px;

    ${is('collapse')`
        @media (min-width: 1025px) {
            display: none;
        }
    `};
`;

const CollapsedIcon = styled(Icon).attrs({ name: 'chevron' })`
    display: block;
    width: 22px;
    height: 22px;

    ${is('down')`
        transform: rotate(0.5turn);
    `};
`;

const Img = styled.img`
    width: 100%;
    margin: 2px 9px 16px 9px;
`;

const Title = styled.span`
    line-height: 20px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
`;

const TimeRemains = styled.span`
    margin: 20px 0 2px;
    text-align: center;
    font-size: 12px;
    color: #a7a7a7;
`;

const Timer = styled.span`
    display: flex;
    justify-content: center;
    margin-bottom: 22px;
    user-select: none;
    cursor: initial;
`;

const Part = styled.span`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 40px;
    margin: 0 -2px;
`;

const Digits = styled.span`
    letter-spacing: 0.28px;
    font-size: 18px;
    text-align: center;
    font-weight: 500;
    color: #393636;
`;

const DigitsLabel = styled.span`
    margin-top: -1px;
    letter-spacing: 0.15px;
    text-align: center;
    font-size: 10px;
    color: #a7a7a7;
`;

const tickAnimation = keyframes`
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
`;

const ColumnSymbol = styled.span`
    color: #979797;
    font-size: 18px;
    animation: ${tickAnimation} 2s linear infinite;
    animation-timing-function: steps(1, end);

    &::after {
        content: ':';
    }
`;

const VotingButtonsStyled = styled(VotingButtons)`
    margin: 0 -6px;

    & > * {
        flex-grow: 1;
    }
`;

const DetailsBlock = styled.div`
    display: flex;
    justify-content: center;
    margin: 18px 0 -4px;
`;

const DetailsLink = styled(Link)`
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.0759em;
    color: #3b7cf6;
`;

export default class VotingCTA extends PureComponent {
    static getCollapsedState() {
        if (process.browser) {
            return Boolean(localStorage.getItem(VOTING_KEY));
        }

        return false;
    }

    state = {
        isCollapsed: VotingCTA.getCollapsedState(),
        isVotingStarted: Date.now() >= VOTING_TIME_START,
        isHidden: Date.now() >= VOTING_TIME_END,
    };

    componentDidMount() {
        const { isHidden } = this.state;

        if (!isHidden) {
            this.intervalId = setInterval(this.onTick, TICK_EVERY);
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    onTick = () => {
        const now = Date.now();

        if (now >= VOTING_TIME_END) {
            this.setState({
                isHidden: true,
            });
            clearInterval(this.intervalId);
            return;
        }

        this.setState({
            isVotingStarted: now >= VOTING_TIME_START,
        });
    };

    onCollapseClick = () => {
        const { isCollapsed } = this.state;

        const newIsCollapsed = !isCollapsed;

        this.setState({
            isCollapsed: newIsCollapsed,
        });

        if (newIsCollapsed) {
            localStorage.setItem(VOTING_KEY, 'y');
        } else {
            localStorage.removeItem(VOTING_KEY);
        }
    };

    render() {
        const { isHidden, isCollapsed, isVotingStarted } = this.state;

        if (isHidden) {
            return null;
        }

        if (isCollapsed) {
            return (
                <Wrapper collapsed>
                    <Title>{tt('voting_cta.referendum')}</Title>
                    <CollapseButton onClick={this.onCollapseClick}>
                        <CollapsedIcon down={1} />
                    </CollapseButton>
                </Wrapper>
            );
        }

        const timeX = isVotingStarted ? VOTING_TIME_END : VOTING_TIME_START;

        const remains = Math.max(0, timeX.getTime() - Date.now());

        const days = Math.floor(remains / DAY);
        const hours = Math.floor((remains - days * DAY) / HOUR);
        const minutes = Math.floor((remains - days * DAY - hours * HOUR) / MINUTE);

        const endDate = moment(timeX).format('lll');

        return (
            <Wrapper>
                <CollapseButton collapse={1} onClick={this.onCollapseClick}>
                    <CollapsedIcon />
                </CollapseButton>
                <Img src="/images/voting.svg" />
                <Title>{tt('voting_cta.referendum')}</Title>
                <TimeRemains>
                    {isVotingStarted ? tt('voting_cta.time_end') : tt('voting_cta.time_start')}
                </TimeRemains>
                <Timer data-tooltip={endDate} aria-label={endDate}>
                    <Part>
                        <Digits>{nn(days)}</Digits>
                        <DigitsLabel>{tt('voting_cta.timer.days', { count: days })}</DigitsLabel>
                    </Part>
                    <ColumnSymbol />
                    <Part>
                        <Digits>{nn(hours)}</Digits>
                        <DigitsLabel>{tt('voting_cta.timer.hours', { count: hours })}</DigitsLabel>
                    </Part>
                    <ColumnSymbol />
                    <Part>
                        <Digits>{nn(minutes)}</Digits>
                        <DigitsLabel>
                            {tt('voting_cta.timer.minutes', { count: minutes })}
                        </DigitsLabel>
                    </Part>
                </Timer>
                <VotingButtonsStyled />
                <DetailsBlock>
                    <DetailsLink to={VOTING_POST}>{tt('voting_cta.details')}</DetailsLink>
                </DetailsBlock>
            </Wrapper>
        );
    }
}

function nn(number) {
    if (number < 10) {
        return `0${number}`;
    } else {
        return String(number);
    }
}
