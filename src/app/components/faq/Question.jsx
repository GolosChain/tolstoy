import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    padding: 15px 45px 15px 20px;
    margin-bottom: 20px;
    border-radius: 6px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: 1200px) {
        padding: 14px 34px 14px 16px;
    }
`;

const Title = styled.div`
    color: #212121;
    font-family: 'Open Sans', sans-serif;
    font-size: 20px;
    font-weight: bold;
    line-height: 34px;

    @media (max-width: 1200px) {
        font-size: 18px;
        line-height: 24px;
    }
`;

const Answer = styled.div`
    height: ${props => (props.showAnswer ? 'auto' : '0')};
    margin-top: ${props => (props.showAnswer ? '11px' : '0')};
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    letter-spacing: -0.26px;
    line-height: 24px;
    overflow: hidden;
`;

const Switcher = styled.div`
    position: absolute;
    width: 12px;
    height: 7px;
    top: 34px; 
    right: 20px;
    cursor: pointer;
    background: url('/images/new/faq/${props =>
        props.showAnswer
            ? 'chevron-up.png'
            : 'chevron-down.png'}') no-repeat center;
    
    @media (max-width: 1200px) {
        top: 26px;
        right: 16px;
    }
`;

export default class Question extends PureComponent {
    static propTypes = {
        question: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            showAnswer: false,
            answer: {
                __html: this.addLinkToUrls(props.question.answer),
            },
        };
        this.changeAnswerState = this.changeAnswerState.bind(this);
    }

    addLinkToUrls(str) {
        return str.replace(
            /(https?:[^ )]+)/g,
            '<a href="$1" target="_blank">$1</a>'
        );
    }

    changeAnswerState() {
        this.setState({
            showAnswer: !this.state.showAnswer,
        });
    }

    render() {
        const { question } = this.props;
        const { showAnswer, answer } = this.state;

        return (
            <Wrapper>
                <Switcher
                    showAnswer={showAnswer}
                    onClick={this.changeAnswerState}
                />
                <Title>{question.title}</Title>
                <Answer
                    showAnswer={showAnswer}
                    dangerouslySetInnerHTML={answer}
                />
            </Wrapper>
        );
    }
}
