import React, { PureComponent } from 'react';
import tt from 'counterpart';

import { REGISTRATION_URL } from 'src/app/constants/config';
import { logOutboundLinkClickAnalytics } from 'src/app/helpers/gaLogs';

class Start extends PureComponent {
  state = {
    simple: true,
  };

  logEventAnalytics = () => {
    logOutboundLinkClickAnalytics(`https:${tt('link_to.telegram')}`);
  };

  render() {
    const { simple } = this.state;

    return (
      <div className="landing-start">
        <div className="landing-start-block">
          <div className="column large-12 medium-12 small-12">
            <h1>Golos.io</h1>
            <h2>Блог-платформа следующего поколения</h2>
          </div>
          <div className="row">
            <div className="column small-12 medium-6 large-6">
              <div>
                <iframe
                  width="100%"
                  height="220"
                  src="https://www.youtube.com/embed/8a0TPACOu2k"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="column small-12 medium-6 large-6">
              <p className="landing-start-block-title-text">
                Пишите, фотографируйте, комментируйте и получайте{' '}
                <span data-tooltip="Токены, которыми вознаграждаются посты, можно перевести в любую мировую валюту.">
                  вознаграждение
                </span>{' '}
                за любое действие
              </p>
              <a href={REGISTRATION_URL} className="button">
                Создать аккаунт
              </a>
            </div>
          </div>
        </div>
        <div className="landing-start-block">
          <div className="column large-12 medium-12 small-12">
            <h2>Как это работает?</h2>
            <div className="column large-12 medium-12 small-12">
              <hr />
            </div>
            <div className="column large-12 medium-12 small-12">
              <div className="row">
                <div className="column large-12 medium-12 small-12">
                  <h3>
                    <a
                      className={simple ? '' : 'active'}
                      href="#"
                      onClick={e => this.toggleAnswer(e, true)}
                    >
                      Простой ответ
                    </a>
                    {' / '}
                    <a
                      className={simple ? 'active' : ''}
                      href="#"
                      onClick={e => this.toggleAnswer(e, false)}
                    >
                      Сложный ответ
                    </a>
                  </h3>
                </div>
                <div className="column large-12 medium-12 small-12">{this.renderAnswer()}</div>
                <div className="landing-start-block-center column large-12 medium-12 small-12">
                  <a href={REGISTRATION_URL} className="button">
                    Создать аккаунт
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="landing-start-block">
          <div className="column large-12 medium-12 small-12">
            <div className="row">
              <div className="column large-3 medium-3 small-6">
                <img className="landing-start-image" src="/images/team.svg" />
                <h5>Социальная значимость</h5>
                <p className="landing-start-block-icon-text">
                  Наше сообщество ценит мнения, истории и творческий контент.
                </p>
              </div>
              <div className="column large-3 medium-3 small-6">
                <img className="landing-start-image" src="/images/money.svg" />
                <h5>Выгодно для блогинга</h5>
                <p className="landing-start-block-icon-text">
                  Мы вознаграждаем как авторов, так и читателей — тех, кто оценивает и комментирует
                  публикации
                </p>
              </div>
              <div className="column large-3 medium-3 small-6">
                <img className="landing-start-image" src="/images/rocket.svg" />
                <h5>В интересах каждого</h5>
                <p className="landing-start-block-icon-text">
                  Писать можно обо всем на свете — расскажите о ракетостроении или выложите
                  фотографию любимого кота
                </p>
              </div>
              <div className="column large-3 medium-3 small-6">
                <img className="landing-start-image" src="/images/blockchain.svg" />
                <h5>Инновационная модель</h5>
                <p className="landing-start-block-icon-text">
                  Golos.io работает на блокчейне, а значит информация пользователей принадлежит
                  только им
                </p>
              </div>

              <div className="landing-start-block-center column large-12 medium-12 small-12">
                <a href={REGISTRATION_URL} className="button">
                  Создать аккаунт
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="landing-start-block">
          <div className="column large-12 medium-12 small-12">
            <h2>О нас говорят</h2>
            <div className="column large-12 medium-12 small-12">
              <hr />
            </div>
            <div className="column large-12 medium-12 small-12">
              <div className="row">
                <div className="landing-start-person column large-3 medium-3 small-3">
                  <img
                    className="landing-start-round-img"
                    src="https://imgp.golos.io/120x120/https://images.golos.io/DQmQh3z15LkKqHcBUUfZedzed6Y263rvzJ9F7gn3beUgXrR/vv_ava.jpg"
                  />
                  <p>
                    <b>Познер Online</b>
                  </p>
                  <a href="/@pozneronline">@pozneronline</a>
                </div>
                <div className="column large-9 medium-9 small-9">
                  <p className="landing-start-block-text">
                    «Считаем «Голос» перспективным проектом и постараемся привлечь на него как можно
                    больше пользователей»
                  </p>
                </div>
                <div className="landing-start-block-center column large-12 medium-12 small-12">
                  <a href={REGISTRATION_URL} className="button">
                    Создать аккаунт
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="landing-start-block">
          <div className="column large-12 medium-12 small-12">
            <h2>Зарегистрируйтесь,</h2>
            <div className="row">
              <div className="column large-12 medium-12 small-12">
                <p className="landing-start-block-text reg landing-start-block-center">
                  чтобы начать делиться своими историями, подписываться на интересных авторов,
                  оценивать публикации, знакомиться и получать вознаграждения
                </p>
              </div>
              <div className="landing-start-panel left column large-5 medium-5 small-12">
                <div className="row">
                  <div className="column large-2 medium-2 small-2">
                    <h1>1</h1>
                  </div>
                  <div className="column large-10 medium-10 small-10">
                    <h3 className="">
                      Регистрация
                      <br />
                      бесплатна
                    </h3>
                  </div>
                </div>
              </div>
              <div className="landing-start-panel right column large-5 medium-5 small-12">
                <div className="row">
                  <div className="column large-2 medium-2 small-2">
                    <h1>2</h1>
                  </div>
                  <div className="column large-10 medium-10 small-10">
                    <h3 className="">
                      Вознаграждаем
                      <br />с первой публикации
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="landing-start-block-center column large-12 medium-12 small-12">
            <a href={REGISTRATION_URL} className="button">
              Создать аккаунт
            </a>
          </div>
        </div>
        <div className="landing-start-block">
          <div className="column large-12 medium-12 small-12">
            <h2>Остались вопросы?</h2>
            <div className="column large-12 medium-12 small-12">
              <hr />
            </div>
            <div className="row">
              <div className="column large-12 medium-12 small-12">
                <p className="landing-start-block-text landing-start-block-center">
                  У нас есть собственная <a href="https://wiki.golos.io/">Википедия</a>, со всей
                  информацией про блог-платформу Golos.io. Кроме того, мы оперативно ответим на
                  любой технический вопрос в нашей группе в{' '}
                  <a
                    href={`https:${tt('link_to.telegram')}`}
                    target="_blank"
                    rel="noopener norefferer"
                    onClick={this.logEventAnalytics}
                  >
                    Телеграме
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderAnswer() {
    const { simple } = this.state;

    if (simple) {
      return (
        <p className="landing-start-block-text">
          <b>Golos.io</b> — это блог-платформа на{' '}
          <span data-tooltip="Блокчейн — распределенная база данных">блокчейне</span>, где
          пользователи могут публиковать записи и голосовать за понравившиеся статьи. Голосуя за
          понравившуюся статью, они вознаграждают ее своими «голосами», которые можно перевести в
          реальные деньги.
        </p>
      );
    } else {
      return (
        <p className="landing-start-block-text">
          Каждый день мы отдаем все{' '}
          <span data-tooltip="Майнинг — деятельность по поддержанию блокчейна">намайненое</span> в
          пул вознаграждения авторов. Он распределяется в зависимости от количества «голосов»
          пользователей под каждой публикацией.
        </p>
      );
    }
  }

  toggleAnswer = (e, simple) => {
    e.preventDefault();
    this.setState({ simple });
  };
}

export default {
  path: 'start',
  component: Start,
};
