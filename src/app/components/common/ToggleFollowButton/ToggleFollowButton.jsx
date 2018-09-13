import React, { Fragment } from 'react';
import tt from 'counterpart';
import Icon from '../../golos-ui/Icon/Icon';
import Button from '../../golos-ui/Button/Button';
import PropTypes from 'prop-types';

const ButtonBlock = Button.extend`
    width: 100%;
    height: 100%;
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;
`;

const ToggleFollowButton = ({ isFollow, followFunc, unfollowFunc, className }) => {
    return (
        <div className={className}>
            {isFollow ? (
                <ButtonBlock light onClick={unfollowFunc}>
                    <Icon width="10" height="10" name="cross" />
                    {tt('g.unfollow')}
                </ButtonBlock>
            ) : (
                <ButtonBlock onClick={followFunc}>
                    <Icon width="11" height="8" name="subscribe" />
                    {tt('g.follow')}
                </ButtonBlock>
            )}
        </div>
    );
};

ToggleFollowButton.propTypes = {
    isFollow: PropTypes.bool.isRequired,
    followFunc: PropTypes.func.isRequired,
    unfollowFunc: PropTypes.func.isRequired,
};

export default ToggleFollowButton;
