import React, { PureComponent } from 'react';
import { utils } from 'golos-js';
import { Link } from 'react-router';

export default class Linkify extends PureComponent {
    render() {
        const { children } = this.props;

        const parts = [];

        let prevPosition = 0;

        children.replace(/https?:\/\/[^\s)]+/g, (url, position) => {
            if (position > prevPosition) {
                const stringWithoutLink = children.substring(prevPosition, position);

                parts.push(addLinkToUser(stringWithoutLink));
            }

            parts.push(
                <a key={position} href={url} target="_blank">
                    {url}
                </a>
            );

            prevPosition = position + url.length;
        });

        if (prevPosition < children.length) {
            const tailString = children.substring(prevPosition, children.length);

            parts.push(addLinkToUser(tailString));
        }

        return <span>{parts}</span>;
    }
}

function addLinkToUser(str) {
    const parts = [];

    let prevPosition = 0;

    str.replace(/@[a-z][a-z0-9.-]+[a-z0-9]/gi, (accountName, position) => {
        if (position > prevPosition) {
            parts.push(str.substring(prevPosition, position));
        }
        if (utils.validateAccountName(accountName.substring(1)) === null) {
            parts.push(
                <Link key={position} to={`/${accountName}`}>
                    {accountName}
                </Link>
            );
        } else {
            parts.push(accountName);
        }

        prevPosition = position + accountName.length;
    });

    if (prevPosition < str.length) {
        parts.push(str.substring(prevPosition, str.length));
    }

    return parts;
}
