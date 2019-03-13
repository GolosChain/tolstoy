import React, { PureComponent, createRef } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { shareList } from 'src/app/helpers/socialShare';
import Icon from 'golos-ui/Icon';

const Root = styled.div`
    position: absolute;
    right: 50%;
    bottom: 100%;
    padding: 5px 0;
    margin-right: -24px;
    margin-bottom: 5px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    animation: from-up 0.2s;
    z-index: 1000;
`;

const Pointer = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
    margin: -6px 12px;
    width: 14px;
    height: 14px;
    transform: rotate(45deg);
    background: #fff;
    box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.05);
`;

const Content = styled.div`
    position: relative;
    background: #fff;
    z-index: 1;
`;

const ListGroup = styled.div`
    padding: 4px 15px 0;
    font-size: 13px;
    color: #aaa;
    user-select: none;
    cursor: default;
`;

const List = styled.ul`
    margin: 0;
`;

const Separator = styled.div`
    height: 1px;
    margin: 3px 0;
    background: #e1e1e1;
`;

const Item = styled.li`
    display: flex;
    align-items: center;
    padding: 4px 16px;
    color: #393636;
    background: #fff;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s;

    &:hover {
        color: #333;
        background: #f5f5f5;
    }
`;

const ItemIcon = styled(Icon)`
    width: 18px;
    height: 18px;
    margin-right: 8px;
    flex-shrink: 0;
`;

const ItemText = styled.div`
    white-space: nowrap;
    font-size: 14px;
`;

export default class CompactPostCardMenu extends PureComponent {
    root = createRef();

    componentDidMount() {
        // Отсрочка на timeout для того чтобы не словить click который и открыл это меню.
        setTimeout(() => {
            window.addEventListener('click', this.onAwayClick);
        });
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onAwayClick);
    }

    onAwayClick = e => {
        if (!this.root.current.contains(e.target)) {
            this.props.onClose();
        }
    };

    onShareClick(callback) {
        const { post } = this.props;

        callback(post);
        this.props.onClose();
    }

    onFavoriteClick = () => {
        const { post, isFavorite } = this.props;

        this.props.toggleFavorite(`${post.author}/${post.permlink}`, !isFavorite);
        this.props.onClose();
    };

    render() {
        const { isFavorite } = this.props;

        const favoriteText = isFavorite ? tt('g.remove_from_favorites') : tt('g.add_to_favorites');

        return (
            <Root ref={this.root}>
                <Pointer />
                <Content>
                    <ListGroup>{tt('post_card_menu.share_in')}:</ListGroup>
                    <List>
                        {shareList.map(item => (
                            <Item key={item.icon} onClick={() => this.onShareClick(item.callback)}>
                                <ItemIcon name={item.icon} />
                                <ItemText>{item.label}</ItemText>
                            </Item>
                        ))}
                    </List>
                    <Separator />
                    <Item onClick={this.onFavoriteClick}>
                        <ItemIcon name="star" />
                        <ItemText>{favoriteText}</ItemText>
                    </Item>
                </Content>
            </Root>
        );
    }
}
