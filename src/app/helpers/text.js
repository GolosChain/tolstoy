import React from 'react';

export function boldify(text) {
    const parts = text.split('**');

    const result = [];

    for (let i = 0; i < parts.length; ++i) {
        const part = parts[i];

        if (i % 2 === 0) {
            result.push(part);
        } else {
            result.push(<b key={i}>{part}</b>);
        }
    }

    return result;
}
