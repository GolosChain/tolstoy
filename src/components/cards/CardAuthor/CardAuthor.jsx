import React, { Component, Fragment } from 'react';
import { Link } from 'mocks/react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';
import Userpic from 'components/common/Userpic';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';

import {
  AvatarBox,
  PopoverBackgroundShade,
  PopoverStyled,
} from 'components/post/PopoverAdditionalStyles';
import PopoverBody from 'containers/post/popoverBody';

const USER_PIC_SIZE = 37;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  margin-right: 18px;
`;

const Avatar = styled.span`
  position: relative;
  display: flex;
  margin-right: 10px;
  border-radius: 50%;
  cursor: pointer;
`;

const AvatarLink = Avatar.withComponent(Link);

const PostDesc = styled.div`
  font-family: ${a => a.theme.fontFamily};
`;

const AuthorLine = styled.div`
  margin-bottom: 3px;
  line-height: 1.1;
`;

const AuthorName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
`;

const AuthorNameLink = styled(AuthorName.withComponent(Link))`
  cursor: pointer;
`;

const PostDate = styled.span`
  display: block;
  font-size: 13px;
  letter-spacing: 0.4px;
  line-height: 1.5;
  white-space: nowrap;
  color: #959595;

  &:hover,
  &:focus {
    color: #8b8989;
  }
`;

const PostDateLink = styled(PostDate.withComponent(Link))`
  cursor: pointer;
`;

const RepostIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  bottom: -6px;
  left: -6px;
  width: 20px;
  height: 20px;

  border-radius: 50%;
  background-color: #ffffff;
`;

const RepostIcon = styled(Icon)`
  flex-shrink: 0;
  color: #2879ff;
`;

export default class CardAuthor extends Component {
  static propTypes = {
    author: PropTypes.string.isRequired,
  };

  static defaultProps = {
    contentLink: null,
    popoverOffsetTop: 52,
  };

  closePopoverTs = 0;

  state = {
    showPopover: false,
  };

  openPopover = e => {
    const { infoPopover, commentInPost } = this.props;
    if (!infoPopover) {
      return;
    }

    e.preventDefault();
    if (commentInPost) {
      e.stopPropagation();
    }
    if (Date.now() > this.closePopoverTs + 200) {
      this.setState({
        showPopover: true,
      });
    }
  };

  closePopover = () => {
    this.closePopoverTs = Date.now();

    this.setState({
      showPopover: false,
    });
  };

  renderPopover() {
    const { author, popoverOffsetTop } = this.props;
    const { showPopover } = this.state;

    return (
      <Fragment>
        <PopoverBackgroundShade show={showPopover} />
        {showPopover && (
          <AvatarBox popoverOffsetTop={popoverOffsetTop} userPicSize={USER_PIC_SIZE}>
            <PopoverStyled closePopover={this.closePopover} show>
              <PopoverBody accountName={author} closePopover={this.closePopover} />
            </PopoverStyled>
          </AvatarBox>
        )}
      </Fragment>
    );
  }

  render() {
    const {
      contentLink,
      author,
      isRepost,
      created,
      noLinks,
      commentInPost,
      className,
    } = this.props;

    let AvatarComp = AvatarLink;
    let AuthorNameComp = AuthorNameLink;
    let PostDateComp = PostDateLink;

    if (noLinks) {
      AvatarComp = Avatar;
      AuthorNameComp = AuthorName;
    }

    if (commentInPost || noLinks) {
      PostDateComp = PostDate;
    }

    return (
      <Fragment>
        {this.renderPopover()}
        <Wrapper className={className}>
          <AvatarComp
            to={`/@${author}`}
            aria-label={tt('aria_label.avatar')}
            onClick={this.openPopover}
          >
            <Userpic account={author} size={USER_PIC_SIZE} />
            {isRepost ? (
              <RepostIconWrapper>
                <RepostIcon name="repost" width={14} height={12} />
              </RepostIconWrapper>
            ) : null}
          </AvatarComp>
          <PostDesc>
            <AuthorLine>
              <AuthorNameComp to={`/@${author}`}>{author}</AuthorNameComp>
            </AuthorLine>
            <PostDateComp to={contentLink}>
              <TimeAgoWrapper date={created} />
            </PostDateComp>
          </PostDesc>
        </Wrapper>
      </Fragment>
    );
  }
}
