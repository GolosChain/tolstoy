import React from 'react';
import { pageView } from 'app/utils/Analytics';

export default class PageViewsCounter extends React.Component {
    constructor(props) {
        super(props);
        this.last_page = null;
    }

    trackPageView() {
        this.last_page = window.location.pathname;
        pageView(this.last_page);
    }

    componentDidMount() {
        this.trackPageView();
    }

    shouldComponentUpdate() {
        return window.location.pathname !== this.last_page;
    }

    componentDidUpdate() {
        this.trackPageView();
    }

    render() {
        return <span></span>;
    }
}
