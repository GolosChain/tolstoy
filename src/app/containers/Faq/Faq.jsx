import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Header from '../../components/faq/Header';
import QuestionsList from '../../components/faq/QuestionsList';
import Channels from '../../components/faq/Channels';
import Footer from '../../components/faq/Footer';

const Wrapper = styled.div`
    background-color: #ffffff;
`;

export default class Faq extends Component {
    constructor() {
        super();
        const lang = tt.getLocale();
        
        this.questions = require(lang === 'en'
            ? './questions_EN.json'
            : './questions_RU.json');
        this.channels = require(lang === 'en'
            ? './channels_EN.json'
            : './channels_RU.json');
    }

    render() {
        return (
            <Wrapper>
                <Header />
                <QuestionsList questions={this.questions} />
                <Channels channels={this.channels} />
                <Footer />
            </Wrapper>
        );
    }
}
