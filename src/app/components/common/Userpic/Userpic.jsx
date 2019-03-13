import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cn from 'classnames';

import proxifyImageUrl from 'src/app/utils/ProxifyUrl';
import { loadUserLazy } from 'src/app/helpers/users';

const DEFAULT_AVATAR = '/images/user.png';

export const UserPicBlock = styled.div`
    display: inline-block;
    position: relative;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    overflow: hidden;
`;

export default class Userpic extends PureComponent {
    static propTypes = {
        account: PropTypes.string,
        size: PropTypes.number,
        onClick: PropTypes.func,
        ariaLabel: PropTypes.string,
    };

    static defaultProps = {
        size: 48,
        hideIfDefault: false,
    };

    extractUrl() {
        const { account, jsonMetadata, size, hideIfDefault } = this.props;

        let url = null;

        if (jsonMetadata) {
            try {
                const md = JSON.parse(jsonMetadata);

                if (md.profile) {
                    url = md.profile.profile_image;
                }
            } catch (err) {
                console.error('Try to extract image url from users metaData failed:', err);
            }
        } else if (process.env.BROWSER) {
            loadUserLazy(account);
        }

        if (url && /^(?:https?:)\/\//.test(url)) {
            return proxifyImageUrl(url, size && size > 120 ? '320x320' : '120x120');
        }

        if (hideIfDefault) {
            return null;
        }

        return DEFAULT_AVATAR;
    }

    render() {
        const { size, ariaLabel, className, onClick } = this.props;

        const style = {
            width: size,
            height: size,
            backgroundImage: `url("${this.extractUrl()}")`,
        };

        return (
            <UserPicBlock
                className={cn('Userpic', className)}
                aria-label={ariaLabel}
                style={style}
                onClick={onClick}
            />
        );
    }
}
