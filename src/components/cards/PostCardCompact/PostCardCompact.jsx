import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'next/router';
import styled, { css } from 'styled-components';
import is from 'styled-is';
import { Link } from 'mocks/react-router';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import { listenLazy } from 'helpers/hoc';
import { getImageSrc } from 'helpers/images';
import { breakWordStyles } from 'helpers/styles';
import { smartTrim } from 'helpers/text';
import { VotePanelCompact } from 'components/common/VotePanel';
import { ReplyBlock } from '../../common/ReplyBlock';
import CompactPostCardMenu from 'components/common/CompactPostCardMenu';
import { detransliterate, repLog10 } from 'utils/ParsersAndFormatters';
import { isContainTags } from 'utils/StateFunctions';
import ViewCount from '../../common/ViewCount';
import CurationPercent from '../../common/CurationPercent';

const MOBILE_THRESHOLD = 500;
const PREVIEW_WIDTH = 148;
const PREVIEW_HEIGHT = 80;
const MOBILE_PREVIEW_WIDTH = 108;
const MOBILE_PREVIEW_HEIGHT = 60;
const EXTEND_HEADER_THRESHOLD = 850;
const PREVIEW_SIZE = `${PREVIEW_WIDTH}x${PREVIEW_HEIGHT}`;

const TEXT_LENGTH_LIMIT = 194; // Примерно 3 строки текста
const MOBILE_TEXT_LENGTH_LIMIT = 120;

const Wrapper = styled.div`
  margin-bottom: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    margin-bottom: 10px;
    border-radius: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: 0 20px;

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    padding: 0 16px;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${EXTEND_HEADER_THRESHOLD}px) {
    display: block;
  }
`;

const Header = styled.div`
  margin-bottom: 16px;
  border-bottom: 1px solid #e1e1e1;

  @media (max-width: ${EXTEND_HEADER_THRESHOLD}px) {
    margin-bottom: 2px;
    border-bottom: none;
  }
`;

const HeaderLeft = styled(ContentWrapper)`
  display: flex;
  align-items: center;
  min-height: 48px;

  @media (max-width: ${EXTEND_HEADER_THRESHOLD}px) {
    border-bottom: 1px solid #e1e1e1;
  }
`;

const HeaderRight = styled(ContentWrapper)`
  display: flex;
  align-items: center;
  min-height: 48px;

  & > * {
    margin-left: 28px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const Body = styled.div`
  margin-top: -4px;
  overflow: hidden;
`;

const PostTitle = styled.div`
  padding-top: 3px;
  margin-bottom: 9px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.13;
  color: #393636;
  ${breakWordStyles};

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    margin-bottom: 4px;
    line-height: 1.14;
    font-size: 14px;
  }
`;

const activeStyle = css`
  color: #959595;
  cursor: pointer;
  transition: color 0.15s;

  &:focus,
  &:hover {
    color: #333;
  }
`;

const LinkStyled = styled(Link)`
  ${activeStyle};
`;

const PostContent = styled.div`
  font-size: 14px;
  line-height: 1.29;
  color: #393636;
  ${breakWordStyles};

  ${is('repost')`
        padding-top: 3px;
        margin-bottom: 7px;
    `};

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    font-size: 12px;
    line-height: 1.08;
  }
`;

const BodyBlock = styled.div`
  display: flex;
`;

const PostImage = styled.img`
  width: ${PREVIEW_WIDTH}px;
  height: ${PREVIEW_HEIGHT}px;
  border-radius: 6px;

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    width: ${MOBILE_PREVIEW_WIDTH}px;
    height: ${MOBILE_PREVIEW_HEIGHT}px;
  }
`;

const Filler = styled.div`
  flex-grow: 1;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  margin-top: 6px;
  min-height: 20px;

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    justify-content: space-between;
    padding-bottom: 0;
    margin-top: 0;

    ${Filler} {
      display: none;
    }
  }
`;

const Splitter = styled.div`
  flex-shrink: 0;
  width: 1px;
  height: 20px;
  margin: 0 10px;
  background: #e1e1e1;

  @media (max-width: 1100px) {
    margin: 0 5px;
  }

  @media (max-width: 370px) {
    margin: 0;
  }

  @media (max-width: 340px) {
    margin: 0 -1px;
  }
`;

const DetailsBlock = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #393636;
  user-select: none;
  overflow: hidden;
`;

const DateLink = styled(LinkStyled)`
  font-size: 13px;
  color: #959595;
`;

const AuthorLink = styled(LinkStyled)`
  padding-left: 3px;
  padding-right: 3px;
  user-select: none;
  white-space: nowrap;
  color: #393636;
`;

const RepostArrowIcon = styled(Icon).attrs({ name: 'repost_solid' })`
  width: 9px;
  margin: 0 2px;

  @media (max-width: 500px) {
    margin: 0;
  }
`;

const AuthorName = styled.div`
  display: inline-block;
`;

const AuthorRating = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 18px;
  margin-left: 4px;
  border: 1px solid #b7b7b9;
  border-radius: 100px;
  text-align: center;
  font-size: 12px;
  transition: border-color 0.15s;
`;

const CategoryLink = styled(LinkStyled)`
  padding-left: 5px;
  padding-right: 10px;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #393636;
`;

const CategoryLinkIn = styled.span`
  color: #393636;
`;

const ImageLink = styled(Link)`
  flex-shrink: 0;
  margin-right: 19px;

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    margin-right: 15px;
  }
`;

const BodyLink = styled(Link)`
  display: block;
`;

const RepostButton = styled.button`
  padding: 0 10px;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  ${activeStyle};
`;

const RepostIcon = styled(Icon).attrs({
  name: 'repost',
})`
  display: block;
  width: 17px;

  @media (max-width: 500px) {
    width: 15px;
  }
`;

const MenuWrapper = styled.div`
  position: relative;
`;

const DotsIcon = styled(Icon).attrs({
  name: 'dots_horizontal',
})`
  display: block;
  width: 38px;
  padding: 0 10px;
  margin-right: -10px;
  color: #959595;
  user-select: none;
  ${activeStyle};

  @media (max-width: 500px) {
    width: 34px;
  }
`;

@withRouter
@listenLazy('resize')
export default class PostCardCompact extends PureComponent {
  state = {
    menu: false,
    mobile: process.env.BROWSER ? window.innerWidth < MOBILE_THRESHOLD : false,
  };

  onRepostClick = () => {
    this.props.openRepostDialog(this.props.postLink);
  };

  onMenuHandlerClick = () => {
    this.setState({
      menu: true,
    });
  };

  onMenuClose = () => {
    this.setState({
      menu: false,
    });
  };

  // called by @listenLazy
  onResize = () => {
    this.setState({
      mobile: window.innerWidth < MOBILE_THRESHOLD,
    });
  };

  renderHeader() {
    const { permLink, data, reblogData, isRepost } = this.props;

    let created;

    if (isRepost) {
      created = reblogData.get('date');
    } else {
      created = data.get('created');
    }

    return (
      <Header>
        <HeaderWrapper>
          <HeaderLeft>{this.renderDetails()}</HeaderLeft>
          <HeaderRight>
            <ViewCount postLink={permLink} micro />
            <CurationPercent postLink={permLink} micro />
            <DateLink to={data.get('url')}>
              <TimeAgoWrapper date={created} />
            </DateLink>
          </HeaderRight>
        </HeaderWrapper>
      </Header>
    );
  }

  renderBody() {
    const { sanitizedData, stats, isRepost, repostHtml, data, warnNsfw } = this.props;
    const { mobile } = this.state;
    const withImage = sanitizedData.image_link && !stats.gray && !stats.hide;

    let trimLength = mobile ? MOBILE_TEXT_LENGTH_LIMIT : TEXT_LENGTH_LIMIT;
    const imageLink =
      warnNsfw && isContainTags(data, ['nsfw'])
        ? '/images/nsfw/nsfw.svg'
        : getImageSrc(PREVIEW_SIZE, sanitizedData.image_link);

    if (withImage) {
      trimLength = Math.floor(trimLength * 1.3);
    }

    return (
      <BodyBlock to={sanitizedData.link} onClick={this.props.onClick}>
        {withImage ? (
          <ImageLink to={sanitizedData.link} onClick={this.props.onClick}>
            <PostImage alt={tt('aria_label.post_image')} src={imageLink} />
          </ImageLink>
        ) : null}
        <Body>
          <BodyLink to={sanitizedData.link} onClick={this.props.onClick}>
            {isRepost ? <PostContent repost dangerouslySetInnerHTML={repostHtml} /> : null}
            <PostTitle>{sanitizedData.title}</PostTitle>
            <PostContent
              dangerouslySetInnerHTML={{
                __html: smartTrim(sanitizedData.desc, trimLength),
              }}
            />
          </BodyLink>
        </Body>
      </BodyBlock>
    );
  }

  renderRepostButton() {
    const { allowRepost } = this.props;

    if (allowRepost) {
      return (
        <Fragment>
          <Splitter />
          <RepostButton
            aria-label={tt('post_card.repost')}
            data-tooltip={tt('post_card.repost')}
            onClick={this.onRepostClick}
          >
            <RepostIcon />
          </RepostButton>
        </Fragment>
      );
    }
  }

  renderDetails() {
    const { data, params, isRepost, reblogData } = this.props;

    const category = detransliterate(data.get('category'));
    const categoryTooltip = tt('aria_label.category', { category: category });

    const currentFeed =
      params.order && params.category !== 'feed' ? `/${params.order}` : '/trending';

    return (
      <DetailsBlock>
        {isRepost ? (
          <Fragment>
            <AuthorLink to={`/@${reblogData.get('repostAuthor')}`}>
              <AuthorName>{reblogData.get('repostAuthor')}</AuthorName>
            </AuthorLink>
            <RepostArrowIcon />
          </Fragment>
        ) : null}
        <AuthorLink to={`/@${data.get('author')}`}>
          <AuthorName>{data.get('author')}</AuthorName>
          <AuthorRating>{repLog10(data.get('author_reputation'))}</AuthorRating>
        </AuthorLink>
        <CategoryLink to={`${currentFeed}?tags=${category}`} aria-label={categoryTooltip}>
          <CategoryLinkIn>{tt('g.in')}</CategoryLinkIn> {category}
        </CategoryLink>
      </DetailsBlock>
    );
  }

  renderFooter() {
    const { permLink, sanitizedData, data, isFavorite } = this.props;
    const { menu } = this.state;

    return (
      <Footer>
        <VotePanelCompact contentLink={permLink} splitter={Splitter} />
        <Splitter />
        <ReplyBlock mini count={data.get('children')} link={data.get('url')} />
        {this.renderRepostButton()}
        <Filler />
        <MenuWrapper>
          {menu ? (
            <CompactPostCardMenu
              post={sanitizedData}
              isFavorite={isFavorite}
              onClose={this.onMenuClose}
            />
          ) : null}
          <DotsIcon onClick={this.onMenuHandlerClick} />
        </MenuWrapper>
      </Footer>
    );
  }

  render() {
    const { hideNsfw, isHidden } = this.props;

    if (hideNsfw || isHidden) {
      return null;
    }

    return (
      <Wrapper>
        {this.renderHeader()}
        <ContentWrapper>
          {this.renderBody()}
          {this.renderFooter()}
        </ContentWrapper>
      </Wrapper>
    );
  }
}
