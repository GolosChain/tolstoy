import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import tt from 'counterpart';

import extractContent from 'app/utils/ExtractContent';
import { detransliterate } from 'app/utils/ParsersAndFormatters';
import Icon from 'golos-ui/Icon';

import Userpic from 'app/components/elements/Userpic';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import VotePanel from 'src/app/components/common/VotePanel';
import ReBlog from 'src/app/components/post/ReBlog';

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
    display: flex;
    align-items: center;
    height: 72px;
    padding: 0 20px;
    box-shadow: 0px -7px 20px #fff;
`;

const HeaderProfile = styled(Link)`
    display: flex;
    align-items: center;
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
    margin-left: auto;
    border: 1px solid #cde0ff;
    border-radius: 6px;
    font-size: 12px;
    color: #2879ff;

    &:hover {
        border: 1px solid #2879ff;
    }
`;

const Action = styled.div`
    display: flex;
    padding: 5px;
    margin: 0 -5px 0 15px;
    cursor: pointer;
    transition: transform 0.15s;

    &:hover {
        transform: scale(1.15);
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
`;

const VotePanelWrapper = styled(VotePanel)`
    padding: 0;
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 20px 15px 20px;
`;

const ReBlogWrapper = styled(ReBlog)`
    margin-left: auto;
`;

const ToReplies = styled(Link)`
    display: flex;
    align-items: center;
    margin-left: 40px;
    
    ${ActionIcon} {
        color: #393636;
    }
`;

const CommentsCount = styled.div`
    margin-left: 10px;
    font-size: 16px;
    color: #959595;
`;

export default class CardPost extends Component {
    renderActions() {
        let isFavorite = true;

        const favoriteTooltip = isFavorite
            ? tt('g.remove_from_favorites')
            : tt('g.add_to_favorites');

        return (
            <Action role="button" data-tooltip={favoriteTooltip} aria-label={favoriteTooltip}>
                <ActionIcon name={isFavorite ? 'star_filled' : 'star'} size="20" />
            </Action>
        );
    }

    render() {
        const { post, className } = this.props;
        const p = extractContent(post);
        const contentLink = `${p.author}/${p.permlink}`;

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
                    {this.renderActions()}
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
                </Main>
            </Root>
        );
    }
}
