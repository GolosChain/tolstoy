import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    display: flex;
    align-items: center;

    height: calc(100vh - 60px);
    max-width: 870px;
    margin: 0 auto;
    color: #393636;
`;

const Content = styled.div`
    display: flex;
    flex-grow: 1;
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-basis: 280px;
    margin-right: 60px;
`;

const InfoTitle = styled.div`
    margin-bottom: 30px;
    font-size: 34px;
    font-weight: 900;
    line-height: 1.21;
    letter-spacing: 0.4px;
`;

const InfoText = styled.div`
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: -0.3px;
`;

const TryReloadText = styled(InfoText)`
    margin-top: 30px;
`;

const Image = styled.div`
    flex-grow: 1;
    height: 435px;
    background: url('/images/errors/content-error-boundary-logo.svg') center no-repeat;
`;

const ReloadButton = styled.div`
    display: flex;
    align-items: center;
    width: 130px;
    padding: 8px 18px;
    margin-top: 50px;
    border-radius: 68px;
    background-color: #2879ff;
    cursor: pointer;

    font-size: 12px;
    font-weight: bold;
    line-height: 1.5;
    color: #ffffff;
    text-transform: uppercase;
    
    & ${Icon} {
        margin-right: 8px;
    }
`;

const WrapperLink = styled(Link)`
    font-size: 12px;
    color: #959595;
    text-decoration: underline;
`;

const Links = styled.div`
    display: flex;
    margin-top: 75px;
    
    & ${WrapperLink}:first-child {
        margin-right: 30px;
    }
`;

export default class ContentErrorBoundary extends Component {
    state = {
        hasError: false,
        error: '',
    };

    componentDidCatch(error) {
        this.setState({
            hasError: true,
            error: error,
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <Wrapper>
                    <Content>
                        <Info>
                            <InfoTitle>Упсс!</InfoTitle>
                            <InfoText>
                                Что-то пошло не так. Мы уже получили уведомление о проблеме и
                                работаем над её устранением. Попробуйте обновить страницу.
                            </InfoText>
                            <TryReloadText>Попробуйте обновить страницу.</TryReloadText>
                            <ReloadButton>
                                <Icon name="reload" size={14} />
                                обновить
                            </ReloadButton>
                            <Links>
                                <WrapperLink to="/">Перейти на главную</WrapperLink>
                                <WrapperLink to="/" target="_blank">Написать в поддержку</WrapperLink>
                            </Links>
                        </Info>
                        <Image />
                    </Content>
                </Wrapper>
            );
        }

        return this.props.children;
    }
}
