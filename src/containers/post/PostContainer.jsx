import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Button from 'golos-ui/Button';
import { blockedUsersContent, blockedContent } from 'src/utils/IllegalContent';
import SidePanel from 'src/containers/post/sidePanel';
import PostContent from 'src/containers/post/postContent';
import LoadingIndicator from 'src/components/elements/LoadingIndicator';
import RegistrationPanel from 'src/components/post/RegistrationPanel';
import AboutPanel from 'src/containers/post/aboutPanel';
import ActivePanel from 'src/containers/post/activePanel';
import CommentsContainer from 'src/containers/post/commentsContainer';
import NotFoundFragment from 'src/components/elements/NotFoundFragment';
import BlockedContent from 'src/components/elements/BlockedContent';

export const POST_MAX_WIDTH = 840;
const POST_MARGINS_MOBILE = 20;
const VIEW_POST_TIMEOUT = 500; // Время необходимое для срабатывания просмотра поста (ms)

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
`;

const ContentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: ${POST_MAX_WIDTH}px;
  padding-top: 22px;
  padding-bottom: 17px;
  margin: 0 auto;

  @media (max-width: ${POST_MAX_WIDTH + POST_MARGINS_MOBILE * 2}px) {
    margin: 0 ${POST_MARGINS_MOBILE}px;
  }

  @media (max-width: 576px) {
    padding-top: 8px;
    margin: 0;
  }
`;

const Loader = styled(LoadingIndicator)`
  margin-top: 30px;
`;

const SpamBlock = styled.div`
  display: flex;
  height: 140px;
  padding: 30px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const SpamText = styled.div`
  margin-right: 10px;
`;

const PostContentWrapper = styled.div``;

export class PostContainer extends Component {
  state = {
    showAlert: this.isNeedShowAlert(this.props),
  };

  postContentRef = createRef();

  componentDidMount() {
    this.seenTimeout = setTimeout(this.recordSeen, VIEW_POST_TIMEOUT);
  }

  componentWillUnmount() {
    clearTimeout(this.seenTimeout);
  }

  componentWillReceiveProps(props) {
    if (!this.props.state && props.state) {
      this.setState({
        showAlert: this.isNeedShowAlert(props),
      });
    }
  }

  isNeedShowAlert(props) {
    if (props.stats) {
      return props.stats.gray || props.stats.hide;
    }

    return false;
  }

  recordSeen = () => {
    try {
      const fingerPrint = require('fingerprintjs2')();

      fingerPrint.get(fingerPrint => {
        const { author, permLink } = this.props;
        this.props.recordPostView(`${author}/${permLink}`, fingerPrint);
      });
    } catch (err) {
      console.warn('Fingerprint getting failed:', err);
    }
  };

  togglePin = () => {
    const { author, permLink, isPinned, togglePin } = this.props;
    togglePin(author + '/' + permLink, !isPinned);
  };

  toggleFavorite = () => {
    const { author, permLink, isFavorite, toggleFavorite } = this.props;
    toggleFavorite(author + '/' + permLink, !isFavorite);
  };

  onShowClick = () => {
    this.setState({
      showAlert: false,
    });
  };

  render() {
    const { postLoaded, user, isOwner, isHidden, author, permLink } = this.props;
    const { showAlert } = this.state;
    if (!postLoaded) {
      return <Loader type="circle" center size={40} />;
    }

    if (isHidden) {
      return <NotFoundFragment />;
    }

    if (blockedUsersContent.includes(author) || blockedContent.includes(`${author}/${permLink}`)) {
      return <BlockedContent reason={tt('g.blocked_user_content')} />;
    }

    if (showAlert) {
      return (
        <Wrapper>
          <SpamBlock>
            <SpamText>{tt('post.hidden')}</SpamText>
            <Button light onClick={this.onShowClick}>
              {tt('g.show')}
            </Button>
          </SpamBlock>
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <ContentWrapper>
          <PostContentWrapper ref={this.postContentRef}>
            <PostContent togglePin={this.togglePin} toggleFavorite={this.toggleFavorite} />
          </PostContentWrapper>
          <ActivePanel togglePin={this.togglePin} toggleFavorite={this.toggleFavorite} />
          {!isOwner ? <AboutPanel /> : null}
          <SidePanel
            togglePin={this.togglePin}
            toggleFavorite={this.toggleFavorite}
            postContentRef={this.postContentRef}
          />
          {!user && <RegistrationPanel />}
          <CommentsContainer user={user} />
        </ContentWrapper>
      </Wrapper>
    );
  }
}
