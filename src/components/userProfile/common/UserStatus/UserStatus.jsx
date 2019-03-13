import React, { Component } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { MINNOW, CRUCIAN, DOLPHIN, ORCA } from 'src/helpers/users';
import Icon from 'golos-ui/Icon';
import { repLog10 } from 'src/utils/ParsersAndFormatters';

const grey = '#e0e0e0';
const blue = '#2879ff';
const black = '#393636';

const statusesByPower = [MINNOW, CRUCIAN, DOLPHIN, ORCA];

const userStatuses = [
  { name: 'minnow', width: 18, height: 9, color: grey },
  { name: 'crucian', width: 16, height: 12, color: grey },
  { name: 'dolphin', width: 15, height: 15, color: grey },
  { name: 'orca', width: 14.3, height: 15.3, color: grey },
  { name: 'whale', width: 21, height: 13, color: grey },
];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;

  ${is('popover')`
        padding: 20px 0;
    `};
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
  height: 1.15px;
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
    transform: ${props => {
      const { statusLength, percent } = props.toNext;
      return `translate(-${props.progress * statusLength + percent * statusLength}%, -50%)`;
    }};
  }
`;

const ColoredIcon = styled(Icon)`
  color: ${props => props.color};
`;

const Rating = styled.div`
  margin-top: 18px;
  line-height: 1;
  font-size: 14px;
  font-weight: 300;
  color: #393636;
`;

const RatingValue = styled.span`
  font-weight: bold;
  color: #333;
`;

export default class UserStatus extends Component {
  render() {
    const { userStatus, reputation, popover } = this.props;
    const statusPosition = this.getStatusPosition(userStatuses, userStatus);
    const coloredStatuses = this.getColoredStatuses(userStatuses, statusPosition);
    const toNext = this.getPercentToNextStatus(userStatuses, statusesByPower, statusPosition);

    const rep10 = repLog10(reputation);

    return coloredStatuses ? (
      <Wrapper popover={Boolean(popover)}>
        <Statuses>
          {coloredStatuses.map(status => (
            <ColoredIcon
              name={status.name}
              width={status.width}
              height={status.height}
              data-tooltip={tt(['user_profile', 'account_summary', 'status', status.name])}
              key={status.name}
              color={status.color}
            />
          ))}
        </Statuses>
        <ProgressLine progress={statusPosition} toNext={toNext} />
        {reputation ? (
          <Rating>
            {tt('user_profile.account_summary.reputation')}: <RatingValue>{rep10}</RatingValue>
          </Rating>
        ) : null}
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
