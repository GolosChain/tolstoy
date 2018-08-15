import React, {Component} from 'react';
import styled from 'styled-components';
import Container from '../../components/Container';
import Header from '../../components/faq/Header';
import QuestionsList from '../../components/faq/QuestionsList';
import Channels from '../../components/faq/Channels';
import Footer from '../../components/faq/Footer';

const Wrapper = styled.div`
    background-color: #ffffff;
`;

const FaqContainer = Container.extend`
    @media (max-width: 1200px) {
        margin: 0;
    }
`;

export default class Faq extends Component {

    constructor() {
        super();
        this.questions = require('./questions.json');
    }

    render() {
        return (
            <Wrapper>
                <FaqContainer column>
                    <Header/>
                    <QuestionsList questions={this.questions}/>
                    <Channels/>
                    <Footer/>
                </FaqContainer>
            </Wrapper>
        );
    }
}