import React from 'react';

export default class JoinedToGolos extends React.Component {
    render() {
        let date = new Date(this.props.date);
        // let monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        //     'July', 'August', 'September', 'October', 'November', 'December'
        let monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'явгуста', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        let joinMonth = monthNames[date.getMonth()];
        let joinYear = date.getFullYear();
        return (
            <span>{joinMonth} {joinYear}</span>
        )
    }
}
