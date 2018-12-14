import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import Userpic from 'app/components/elements/Userpic';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';

import { PopoverStyled } from 'src/app/components/post/PopoverAdditionalStyles';
import PopoverBody from 'src/app/containers/post/popoverBody';

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
    margin: 3px 0;
    line-height: 1.1;
`;

const AuthorName = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #333;
    text-decoration: none;
`;

const AuthorNameLink = AuthorName.withComponent(Link);

const PostDate = styled(Link)`
    display: block;
    font-size: 13px;
    letter-spacing: 0.4px;
    line-height: 1.5;
    white-space: nowrap;
    color: #959595;
    cursor: pointer;

    &:hover,
    &:focus {
        color: #8b8989;
    }
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

const AvatarBox = styled.div`
    position: absolute;
    top: 42px;
    width: ${USER_PIC_SIZE}px;
`;

export default class CardAuthor extends Component {
    static propTypes = {
        author: PropTypes.string.isRequired,
    };

    static defaultProps = {
        contentLink: null,
    };

    closePopoverTs = 0;

    state = {
        showPopover: false,
    };

    openPopover = e => {
        e.preventDefault();

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

    render() {
        const { contentLink, author, permLink, isRepost, created, noLinks, className } = this.props;
        const { showPopover } = this.state;

        let AvatarComp = AvatarLink;
        let AuthorNameComp = AuthorNameLink;

        if (noLinks) {
            AvatarComp = Avatar;
            AuthorNameComp = AuthorName;
        }

        return (
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
                    <PostDate to={contentLink}>
                        <TimeAgoWrapper date={created} />
                    </PostDate>
                </PostDesc>
                {showPopover ? (
                    <AvatarBox>
                        <PopoverStyled onClose={this.closePopover} show>
                            <PopoverBody
                                close={this.closePopover}
                                permLink={`${author}/${permLink}`}
                            />
                        </PopoverStyled>
                    </AvatarBox>
                ) : null}
            </Wrapper>
        );
    }
}
