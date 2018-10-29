import { Long } from 'bytebuffer';

export function commentsArrayToObject(arr) {
    const result = [...arr];
    return result.reduce((obj, item) => {
        obj[`${item.author}/${item.permlink}`] = item;
        return obj;
    }, {});
}
