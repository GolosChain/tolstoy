import { PINNED_TOGGLE } from '../constants/pinnedPosts';

export function togglePin(link, isPin) {
    return { type: PINNED_TOGGLE, payload: { link, isPin } };
}
