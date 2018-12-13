import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { MINNOW, CRUCIAN, DOLPHIN, ORCA } from 'src/app/helpers/users';
import Icon from 'golos-ui/Icon';

const grey = '#e0e0e0';
const blue = '#2879ff';
const black = '#393636';

const statusesByPower = [MINNOW, CRUCIAN, DOLPHIN, ORCA];

const userStatuses = [
    { name: 'minnow', width: 18, height: 9, color: grey },
    { name: 'crucian', width: 16, height: 12, color: grey },
    { name: 'dolphin', width: 15, height: 15, color: grey },
    { name: 'orca', width: 14.3, height: 15.3, color: grey },
    { name: 'whale', width: 16, height: 16, color: grey },
];

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
`;

const Statuses = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-bottom: 7px;
`;

const ProgressLine = styled.div`
    width: 100%;
    height: 1px;
    position: relative;
    background-color: #d8d8d8;

    &::before {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        height: 100%;
        width: ${props => {
            const { statusLength, percent } = props.toNext;
            return props.progress * statusLength + percent * statusLength;
        }}%;
        background-color: #2879ff;
    }

    &::after {
        position: absolute;
        content: '';
        top: 0;
        left: ${props => {
            const { statusLength, percent } = props.toNext;
            return props.progress * statusLength + percent * statusLength;
        }}%;
        height: 5px;
        width: 5px;
        border-radius: 100px;
        background-color: #2879ff;
        transform: translate(-100%, -50%);
    }
`;

const ColoredIcon = styled(Icon)`
    color: ${props => props.color};
`;

export default class UserStatus extends Component {
    render() {
        const { userStatus } = this.props;
        const statusPosition = this.getStatusPosition(userStatuses, userStatus);
        const coloredStatuses = this.getColoredStatuses(userStatuses, statusPosition);
        const toNext = this.getPercentToNextStatus(userStatuses, statusesByPower, statusPosition);

        return coloredStatuses ? (
            <Wrapper>
                <Statuses>
                    {coloredStatuses.map(status => (
                        <ColoredIcon
                            name={status.name}
                            width={status.width}
                            height={status.height}
                            data-tooltip={tt(`user_profile.account_summary.status.${status.name}`)}
                            key={status.name}
                            color={status.color}
                        />
                    ))}
                </Statuses>
                <ProgressLine progress={statusPosition} toNext={toNext} />
            </Wrapper>
        ) : null;
    }

    getStatusPosition = (userStatuses, userStatus) => {
        const currentStatusPosition = userStatuses.findIndex(status => status.name === userStatus);

        return currentStatusPosition;
    };

    getColoredStatuses = (userStatuses, currentStatusPosition) => {
        let coloredUserStatuses;

        if (currentStatusPosition > -1) {
            coloredUserStatuses = userStatuses.map((status, index) => {
                if (index === currentStatusPosition) {
                    return { ...status, color: blue };
                } else if (index < currentStatusPosition) {
                    return { ...status, color: black };
                } else {
                    return status;
                }
            });

            return coloredUserStatuses;
        }

        return null;
    };

    getPercentToNextStatus = (userStatuses, userStatusesByPower, currentPosition) => {
        const { power } = this.props;
        if (currentPosition === userStatuses.length - 1) {
            return {
                statusLength: Number((100 / (userStatuses.length - 1)).toFixed(2)),
                percent: 0,
            };
        }

        return {
            statusLength: Number((100 / (userStatuses.length - 1)).toFixed(2)),
            percent: Number((power / userStatusesByPower[currentPosition]).toFixed(2)),
        };
    };
}
