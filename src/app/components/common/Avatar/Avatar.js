import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import proxifyImageUrl from 'app/utils/ProxifyUrl';

import Icon from 'golos-ui/Icon';

// Optimized for lists. It will not generate new classes
// for every avatar because we don't use props in css
const Wrapper = styled.div.attrs({
    style: ({ backgroundUrl, size }) => ({
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : null,
        height: `${size}px`,
        width:  `${size}px`,
    }),
})`
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;

    color: #E1E1E1;
    box-shadow: 0 0 1px #000;

    ${is('icon')`
        margin-left: 6px;
    `} 
    
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    border-radius: 50%;
    background-color: #fff;
`;

const AvatarBadge = styled.div`
    display: flex;

    position: absolute;
    width: 20px;
    height: 20px;

    left: -6px;
    bottom: -6px;

    color: #2879ff;
    background: #fff;
    border-radius: 50%;

    align-items: center;
    justify-content: center;
`;

export default class Avatar extends PureComponent {
    static propTypes = {
        avatarUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        size: PropTypes.number,
        icon: PropTypes.object,
    };

    static defaultProps = {
        size: 40,
        icon: null,
    };

    render() {
        const { avatarUrl, size, icon } = this.props;
        const backgroundUrl = avatarUrl
            ? proxifyImageUrl(avatarUrl, size && size > 120 ? '320x320' : '120x120')
            : null;

        return (
            <Wrapper backgroundUrl={backgroundUrl} size={size} icon={icon ? 1 : 0}>
                {!backgroundUrl && (
                    <Icon name="avatar-centered" size={size} />
                )}
                {icon && (
                    <AvatarBadge>
                        <Icon {...icon} />
                    </AvatarBadge>
                )}
            </Wrapper>
        );
    }
}
