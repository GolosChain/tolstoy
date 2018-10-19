import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { List } from 'immutable';
import styled from 'styled-components';
import is from 'styled-is';

import { TAGS_MAX_LENGTH } from 'app/utils/tags';

import Icon from 'golos-ui/Icon';
import TagSelect from 'src/app/components/common/TagSelect';

const Wrapper = styled.div``;

const SearchTagsWrapper = styled.div`
    display: flex;
    position: relative;

    margin-bottom: 40px;
`;

const SearchInput = styled.input`
    width: 100%;
    height: 34px;
    padding: 5px 35px 5px 20px;

    font-size: 14px;
    border-radius: 6px;
    border: solid 1px #e1e1e1 !important;

    font-size: 14px;
    color: #b7b7ba !important;
    box-shadow: none !important;
    background: none !important;

    ::placeholder {
        color: #b7b7ba;
    }
`;

const IconStyled = styled(Icon)`
    position: absolute;
    display: flex;

    top: 9px;
    right: 14px;
    color: #393636;
`;

const Title = styled.div`
    position: relative;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.7px;
    color: #333333;
    text-transform: uppercase;

    margin-bottom: 20px;

    ${is('onClick')`
      cursor: pointer;
    `};
`;

const TagsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;

    margin-bottom: 10px;
`;

const CollapseIcon = styled(Icon).attrs({
    width: 12,
    height: 7,
})`
    position: absolute;
    right: 0;
    transform: rotate(0);
    transition: transform 0.4s;

    &:hover {
        color: #000;
    }

    ${is('flip')`
        transform: rotate(0.5turn);
    `};
`;

const ButtonLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;

    height: 34px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    color: #393636 !important;

    border-radius: 17px;
    border: solid 1px rgba(117, 117, 117, 0.3);
`;

const emptyList = List();

export default class TagsCard extends Component {
    static propTypes = {
        order: PropTypes.string,
        tags: PropTypes.instanceOf(List),
        selectedFilterTags: PropTypes.instanceOf(List),
        selectedSelectTags: PropTypes.instanceOf(List),
        collapsed: PropTypes.bool,
        changeHomeTagsCardCollapse: PropTypes.func,
        saveTag: PropTypes.func,
        loadMore: PropTypes.func,
    };

    static defaultProps = {
        tags: [],
        selectedFilterTags: emptyList,
        selectedSelectTags: emptyList,
    };

    onToggleClick = () => {
        this.props.changeHomeTagsCardCollapse(!this.props.collapsed);
    };

    onTagClick = (tag, action) => {
        const { order } = this.props;

        this.props.saveTag(tag, action);
        this.props.loadMore({ order });
    };

    renderTag = (tag, key) => {
        const { selectedSelectTags, selectedFilterTags } = this.props;

        const isSelected = selectedSelectTags.indexOf(tag) !== -1;
        const isFiltered = selectedFilterTags.indexOf(tag) !== -1;

        return (
            <TagSelect
                key={key}
                tag={tag}
                isSelected={isSelected}
                isFiltered={isFiltered}
                onTagClick={this.onTagClick}
            />
        );
    };

    render() {
        const { tags, collapsed } = this.props;

        return (
            <Wrapper>
                <SearchTagsWrapper>
                    <SearchInput
                        type="text"
                        placeholder="Введите тэг"
                        maxLength={TAGS_MAX_LENGTH}
                    />
                    {false ? (
                        <IconStyled name="cross" width="16" height="16" onClick={() => {}} />
                    ) : (
                        <IconStyled name="search" width="16" height="16" />
                    )}
                </SearchTagsWrapper>

                <Title>Популярные теги</Title>
                <TagsWrapper>{tags.map(this.renderTag)}</TagsWrapper>
                <Title onClick={this.onToggleClick}>
                    {collapsed ? 'Показать больше' : 'Свернуть'}
                    <CollapseIcon name="chevron" flip={collapsed ? 1 : 0} />
                </Title>
                {!collapsed && <ButtonLink to="/tags">Показать все</ButtonLink>}
            </Wrapper>
        );
    }
}
