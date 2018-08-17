import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Question from './Question';
import Flex from '../Flex/Flex';

const Wrapper = styled.div`
    padding: 20px 64px 40px;
    max-width: 1200px;

    @media (max-width: 1200px) {
        padding: 30px 16px 16px;
    }
`;

export default class QuestionsList extends PureComponent {
    static propTypes = {
        questions: PropTypes.arrayOf(PropTypes.object),
    };

    static defaultProps = {
        questions: [],
    };

    render() {
        const { questions } = this.props;
        return (
            <Flex justify="center">
                <Wrapper>
                    {questions.map((question, index) => (
                        <Question key={index} question={question} />
                    ))}
                </Wrapper>
            </Flex>
        );
    }
}
