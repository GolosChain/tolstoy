import React, { Component } from 'react';
import tt from 'counterpart';

export default class JoinedToGolos extends Component {
    render() {
        const date = new Date(this.props.date);
        const joinMonth = tt('months_names')[date.getMonth()];
        const joinYear = date.getFullYear();
        return (
            <span>
                {joinMonth} {joinYear}
            </span>
        );
    }
}
