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

export function smartTrim(text, limit, allowSoftTrim = false) {
    if (text.length <= limit) {
        return text;
    }

    text = text.substring(0, limit).trim();

    if (allowSoftTrim) {
        const dotIndex = text.lastIndexOf('. ');
        const softLimit = Math.round(limit * 0.86);

        // If dot near end of characters limit
        if (dotIndex > softLimit) {
            return text.substring(0, dotIndex + 1);
        }
    }

    // Truncate, remove the last (likely partial) word (along with random punctuation), and add ellipses
    return text.replace(/[,!\?]?\s+[^\s]+$/, '…');
}
