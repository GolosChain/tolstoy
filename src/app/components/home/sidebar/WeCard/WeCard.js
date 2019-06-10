import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

const Wrapper = styled.div`
    margin-bottom: 20px;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const WeImage = styled.img.attrs({
    src: '/images/Golunov_Userpic_IWe_blue.jpg',
    alt: 'Я/Мы Иван Голунов',
})`
    width: 100%;
    vertical-align: middle;
`;

export default class WeCard extends Component {
    render() {
        return (
            <Wrapper>
                <a
                    href="https://www.rbc.ru/society/09/06/2019/5cfc80de9a79476ec94c1910"
                    target="_blank"
                >
                    <WeImage />
                </a>
            </Wrapper>
        );
    }
}
