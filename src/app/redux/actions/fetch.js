export function fetchPathStateAction(pathname) {
    return {
        type: 'FETCH_STATE',
        payload: {
            pathname,
        },
    };
}

export function fetchCurrentStateAction() {
    return fetchPathStateAction(location.pathname);
}
