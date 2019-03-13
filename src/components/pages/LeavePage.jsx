import React, { Component } from 'react';
import styled from 'styled-components';
import Button from 'components/elements/Button';

const ButtonStyled = styled(Button)`
  margin-right: 14px;
  outline: none;

  &:last-child {
    margin-right: 0;
  }
`;

const Content = styled.div`
  margin: 80px 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  box-shadow: 0 0 5px 5px rgba(255, 255, 255, 0.6);

  @media (max-width: 840px) {
    margin: 10px;
  }
`;

const ButtonsWrapper = styled.p`
  display: flex;
  justify-content: center;
  margin-bottom: 0;

  & ${ButtonStyled} {
    margin-bottom: 0;
    white-space: nowrap;
  }

  @media (max-width: 840px) and (min-width: 640px), (max-width: 500px) {
    flex-direction: column;

    & ${ButtonStyled}:first-child {
      margin-right: 0;
    }

    & ${ButtonStyled}:last-child {
      margin-top: 10px;
    }
  }
`;

class LeavePage extends Component {
  goBack = () => {
    this.props.router.goBack();
  };

  leaveOut = decodedUrl => () => {
    window.location.assign(decodedUrl);
  };

  render() {
    const targetPage = this.props.location.search.slice(1);
    const decodedUrl = decodeURIComponent(targetPage);

    return (
      <div className="leave-page" style={{ backgroundImage: 'url(images/leave-bg.svg)' }}>
        <div className="leave-page_content row medium-7 large-7">
          <Content>
            <h4>
              Вы покидаете{' '}
              <a href="https://golos.io/" target="_blank">
                Golos.io
              </a>
            </h4>
            <p>
              Вы кликнули на ссылку, ведущую на внешний ресурс, и покидаете блог-платформу{' '}
              <a href="https://golos.io/" target="_blank">
                Golos.io
              </a>
              .
            </p>
            <p>
              Ссылка, на которую вы кликнули, переведет вас по адресу: <strong>{decodedUrl}</strong>
            </p>
            <p>
              <a href="https://golos.io/" target="_blank">
                Golos.io
              </a>{' '}
              не имеет никакого отношения к сайту, расположенному по ссылке выше, и не может
              гарантировать вам безопасность его использования. Сайты с закрытым исходным кодом
              могут содержать вредоносные скрипты и использовать мошеннические схемы.
            </p>
            <p>
              Рекомендуем вам не переходить по ссылке, если у вас нет серьезных оснований доверять
              внешнему ресурсу. Помните, что активный ключ вашего аккаунта на{' '}
              <a href="https://golos.io/" target="_blank">
                Golos.io
              </a>{' '}
              не может быть восстановлен, а доступ к нему позволит мошенникам завладеть всеми вашими
              средствами.
            </p>
            <ButtonsWrapper>
              <ButtonStyled round onClick={this.goBack}>
                Вернуться на Golos.io
              </ButtonStyled>
              <ButtonStyled type="secondary" round onClick={this.leaveOut(decodedUrl)}>
                Перейти по ссылке
              </ButtonStyled>
            </ButtonsWrapper>
          </Content>
        </div>
      </div>
    );
  }
}

export default {
  path: 'leave_page',
  component: LeavePage,
};
