import React, { Fragment } from 'react';
import tt from 'counterpart';
import Icon from '../../golos-ui/Icon';
import Button from '../../golos-ui/Button';
import PropTypes from 'prop-types';

const ButtonBlock = Button.extend`
    min-width: 100%;
    min-height: 100%;
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;
`;

const ToggleFollowButton = ({ isFollow, followUser, unfollowUser, className }) => {
    return (
        <div className={className}>
            {isFollow ? (
                <ButtonBlock light onClick={unfollowUser}>
                    <Icon width="10" height="10" name="cross" />
                    {tt('g.unfollow')}
                </ButtonBlock>
            ) : (
                <ButtonBlock onClick={followUser}>
                    <Icon width="11" height="8" name="subscribe" />
                    {tt('g.follow')}
                </ButtonBlock>
            )}
        </div>
    );
};

ToggleFollowButton.propTypes = {
    isFollow: PropTypes.bool.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
};

export default ToggleFollowButton;
