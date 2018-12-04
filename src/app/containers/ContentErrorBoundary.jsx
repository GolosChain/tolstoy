import React, { Component } from 'react';
import { Link  } from 'react-router';
import tt from 'counterpart';
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
    
    @media (max-width: 945px) {
        flex-direction: column;
    }
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-basis: 280px;
    margin-right: 60px;
    
    @media (max-width: 945px) {
        align-items: center;
        flex-basis: auto;
        margin-right: 0;
    }
`;

const InfoTitle = styled.div`
    margin-bottom: 30px;
    font-size: 34px;
    font-weight: 900;
    line-height: 1.21;
    letter-spacing: 0.4px;
    
    @media (max-width: 945px) {
        margin-bottom: 10px;
    }
`;

const InfoText = styled.div`
    font-size: 16px;
    line-height: 1.38;
    letter-spacing: -0.3px;
    
    @media (max-width: 945px) {
        text-align: center;
    }
`;

const TryReloadText = styled(InfoText)`
    margin-top: 30px;
    color: #959595;
    
    @media (max-width: 945px) {
        margin-top: 10px;
    }
`;

const Image = styled.div`
    flex-grow: 1;
    height: 435px;
    background: url('/images/errors/content-error-boundary-logo.svg') center no-repeat;
    
    @media (max-width: 945px) {
        background-size: contain;
    }
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
    
    &:hover {
        background: #0e69ff;
    }
    
    @media (max-width: 945px) {
        margin-top: 20px;
    }
`;

const WrapperLink = styled(Link)`
    font-size: 12px;
    color: #959595;
    text-decoration: underline;
`;

const Links = styled.div`
    display: flex;
    margin-top: 65px;
    
    & ${WrapperLink}:first-child {
        margin-right: 30px;
    }
    
    @media (max-width: 945px) {
        margin-top: 20px;
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

    reloadPage = () => {
        window.location.reload();
    };

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
                            <ReloadButton onClick={this.reloadPage}>
                                <Icon name="reload" size={14} />
                                обновить
                            </ReloadButton>
                            <Links>
                                <WrapperLink to="/">Перейти на главную</WrapperLink>
                                <WrapperLink to={supportLink()} target="_blank" rel="noopener norefferer">Написать в поддержку</WrapperLink>
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

function supportLink() {
    const locale = tt.getLocale();

    switch (locale) {
        case 'en':
        case 'uk':
            return 'https://t.me/golos_eng';
        case 'ru':
            return 'https://t.me/golos_support';
    }
}
