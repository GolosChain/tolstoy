export const fortmatTime = date => {
    const _date = new Date(date);
    const hh = _date.getHours();
    const mm = _date.getMinutes();
    return `${hh < 10 ? `0${hh}` : hh}:${mm < 10 ? `0${mm}` : mm}`;
};
