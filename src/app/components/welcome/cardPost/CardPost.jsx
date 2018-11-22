import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import tt from 'counterpart';

import extractContent from 'app/utils/ExtractContent';
import { detransliterate } from 'app/utils/ParsersAndFormatters';
import Icon from 'golos-ui/Icon/index';

import Userpic from 'app/components/elements/Userpic';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import VotePanel from 'src/app/components/common/VotePanel';
import ReBlog from 'src/app/components/post/reBlog';
import PostActions from 'src/app/components/post/PostActions';

const Root = styled.div`
    border-radius: 8.5px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    overflow: hidden;
    transition: box-shadow 0.3s ease 0s;

    &:hover {
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1);
    }
`;

const Main = styled.div`
    overflow: hidden;
`;

const Content = styled(Link)`
    display: block;
    padding: 10px 20px;
`;

const ContentTitle = styled.div`
    margin-bottom: 10px;
    line-height: 1.36;
    color: #393636;
    font-family: ${a => a.theme.fontFamilySerif};
    font-size: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ContentText = styled.div`
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #959595;
`;

const Header = styled.div`
    position: relative;
    align-items: center;
    padding: 12px 20px;
    box-shadow: 0px -7px 20px #fff;

    display: grid;
    grid-template-columns: auto 1fr auto 20px auto;
    grid-template-rows: auto;
    grid-template-areas: 'author . category . actions';

    @media (max-width: 1150px) and (min-width: 1024px), (max-width: 439px) {
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto auto;
        row-gap: 15px;
        grid-template-areas:
            'author . actions'
            'category . .';
    }
`;

const HeaderProfile = styled(Link)`
    display: flex;
    align-items: center;
    grid-area: author;
    justify-self: start
`;

const HeaderInfo = styled.div`
    margin-left: 10px;
`;

const HeaderName = styled.div`
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    color: #333;
    margin-bottom: 7px;
`;

const HeaderTime = styled.div`
    font-size: 12px;
    font-weight: 300;
    line-height: 1;
    color: #9fa3a7;
`;

const Category = styled(Link)`
    display: block;
    padding: 5px 8px;
    border: 1px solid #cde0ff;
    border-radius: 6px;
    font-size: 12px;
    color: #2879ff;
    grid-area: category;
    justify-self: start;

    &:hover {
        border: 1px solid #2879ff;
    }
`;

const ActionIcon = styled(Icon)`
    flex-shrink: 0;
`;

const PostImg = styled(({ imgUrl, ...props }) => <Link {...props} />)`
    display: block;
    background: url('${({ imgUrl }) => imgUrl}') center no-repeat;
    background-size: cover;
    height: 225px;
    max-height: 60vh;
    
    @media (max-width: 1150px) and (min-width: 1024px), (max-width: 439px) {
        height: 180px;
    }
`;

const VotePanelWrapper = styled(VotePanel)`
    padding: 0;
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 20px 15px 20px;

    @media (max-width: 1150px) and (min-width: 1024px), (max-width: 439px) {
        align-items: flex-start;
        flex-direction: column;
    }
`;

const ToReplies = styled(Link)`
    display: flex;
    align-items: center;
    margin-left: 40px;

    ${ActionIcon} {
        color: #393636;
    }

    @media (max-width: 1150px) and (min-width: 1024px), (max-width: 439px) {
        display: none;
    }
`;

const ToRepliesMobile = styled(ToReplies)`
    @media (max-width: 1150px) and (min-width: 1024px), (max-width: 439px) {
        display: flex;
        flex-grow: 1;
        justify-content: center;
        height: 100%;
        padding: 15px 0;
        margin-left: 0;
    }
`;

const CommentsCount = styled.div`
    margin-left: 10px;
    font-size: 16px;
    color: #959595;
`;

const PostActionsWrapper = styled.div`
    display: flex;
    grid-area: actions;

    & > * {
        padding: 5px;
    }

    & > a {
        margin-right: 10px;
    }
`;

const ReBlogWrapper = styled(ReBlog)`
    margin-left: auto;

    @media (max-width: 1150px) and (min-width: 1024px), (max-width: 439px) {
        display: none;
    }
`;

const ReBlogWrapperMobile = styled(ReBlogWrapper)`
    @media (max-width: 1150px) and (min-width: 1024px), (max-width: 439px) {
        display: flex;
        flex-grow: 1;
        padding: 20px 0;
    }
`;

const MobileFooter = styled.div`
    display: none;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #e9e9e9;

    @media (max-width: 1150px) and (min-width: 1024px), (max-width: 439px) {
        display: flex;
    }
`;

export class CardPost extends Component {
    togglePin = () => {
        const { contentLink, isPinned, togglePin } = this.props;
        togglePin(contentLink, !isPinned);
    };

    toggleFavorite = () => {
        const { contentLink, isFavorite, toggleFavorite } = this.props;
        toggleFavorite(contentLink, !isFavorite);
    };

    render() {
        const { post, contentLink, isFavorite, isPinned, isOwner, className } = this.props;
        const p = extractContent(post);

        return (
            <Root className={className} aria-label={tt('g.post')}>
                <Header>
                    <HeaderProfile to={`/@${p.author}`} title={p.author}>
                        <Userpic size={40} account={p.author} />
                        <HeaderInfo>
                            <HeaderName>{p.author}</HeaderName>
                            <HeaderTime>
                                <TimeAgoWrapper date={p.created} />
                            </HeaderTime>
                        </HeaderInfo>
                    </HeaderProfile>
                    <Category
                        to={`/trending/${p.category}`}
                        aria-label={tt('aria_label.category', { category: p.category })}
                    >
                        {detransliterate(p.category)}
                    </Category>
                    <PostActionsWrapper>
                        <PostActions
                            fullUrl={p.link}
                            isFavorite={isFavorite}
                            isPinned={isPinned}
                            isOwner={isOwner}
                            toggleFavorite={this.toggleFavorite}
                            togglePin={this.togglePin}
                        />
                    </PostActionsWrapper>
                </Header>
                <Main to={p.link}>
                    {p.image_link && (
                        <PostImg
                            to={p.link}
                            imgUrl={`${$STM_Config.img_proxy_prefix}0x0/${p.image_link}`}
                        />
                    )}
                    <Content to={p.link}>
                        <ContentTitle>{p.title}</ContentTitle>
                        <ContentText>{p.desc}</ContentText>
                    </Content>
                    <Footer>
                        <VotePanelWrapper contentLink={contentLink} />
                        <ReBlogWrapper contentLink={contentLink} />
                        <ToReplies
                            to={`${p.link}#comments`}
                            role="button"
                            data-tooltip={tt('reply.comments_count')}
                            aria-label={tt('aria_label.comments', { count: p.children })}
                        >
                            <ActionIcon width="20" height="20" name="reply" />
                            <CommentsCount>{p.children}</CommentsCount>
                        </ToReplies>
                    </Footer>
                    <MobileFooter>
                        <ReBlogWrapperMobile contentLink={contentLink} />
                        <ToRepliesMobile
                            to={`${p.link}#comments`}
                            role="button"
                            data-tooltip={tt('reply.comments_count')}
                            aria-label={tt('aria_label.comments', { count: p.children })}
                        >
                            <ActionIcon width="20" height="20" name="reply" />
                            <CommentsCount>{p.children}</CommentsCount>
                        </ToRepliesMobile>
                    </MobileFooter>
                </Main>
            </Root>
        );
    }
}
