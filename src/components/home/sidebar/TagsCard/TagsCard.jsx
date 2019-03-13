import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

// import { TAGS_MAX_LENGTH } from 'app/utils/tags';

import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';
import TagSelect from 'src/components/common/TagSelect';

const Wrapper = styled.div`
  margin-bottom: 20px;

  @media (max-width: 500px) {
    display: none;
  }
`;

// const SearchTagsWrapper = styled.div`
//     display: flex;
//     position: relative;

//     margin-bottom: 40px;
// `;

// const SearchInput = styled.input`
//     width: 100%;
//     height: 34px;
//     padding: 5px 35px 5px 20px;

//     font-size: 14px;
//     border-radius: 6px;
//     border: solid 1px #e1e1e1 !important;

//     font-size: 14px;
//     color: #b7b7ba !important;
//     box-shadow: none !important;
//     background: none !important;

//     ::placeholder {
//         color: #b7b7ba;
//     }
// `;

// const IconStyled = styled(Icon)`
//     position: absolute;
//     display: flex;

//     top: 9px;
//     right: 14px;
//     color: #393636;
// `;

const TagSelectStyled = styled(TagSelect)`
  &:not(:last-child) {
    margin-right: 10px;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Title = styled.div`
  position: relative;
  line-height: 1;
  font-size: 14px;
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

  @media (min-width: 768px) {
    margin-bottom: 10px;
  }
`;

const CollapseIcon = styled(Icon).attrs({
  name: 'chevron',
  width: 12,
  height: 7,
})`
  position: absolute;
  right: 0;
  transform: rotate(0.5turn);
  transition: transform 0.4s;

  &:hover {
    color: #000;
  }
`;

// const ButtonLink = styled(Link)`
//     display: flex;
//     align-items: center;
//     justify-content: center;

//     height: 34px;
//     font-size: 12px;
//     font-weight: bold;
//     text-transform: uppercase;
//     color: #393636 !important;

//     border-radius: 17px;
//     border: solid 1px rgba(117, 117, 117, 0.3);
// `;

export default class TagsCard extends Component {
  static propTypes = {
    // connect
    category: PropTypes.string,
    order: PropTypes.string,
    currentUsername: PropTypes.string,
    tags: PropTypes.array,
    tagsSelect: PropTypes.array,
    tagsFilter: PropTypes.array,
    collapsed: PropTypes.bool,
    changeHomeTagsCardCollapse: PropTypes.func,
    saveTag: PropTypes.func,
    loadMore: PropTypes.func,
  };

  static defaultProps = {
    tags: [],
  };

  onToggleClick = () => {
    this.props.changeHomeTagsCardCollapse(!this.props.collapsed);
  };

  onTagClick = (tag, action) => {
    const { category, order, currentUsername } = this.props;

    this.props.saveTag(tag, action);
    this.props.loadMore({ category, order, accountname: currentUsername });
  };

  renderTag = (tag, key) => {
    const { tagsSelect, tagsFilter } = this.props;

    const isSelected = tagsSelect.includes(tag);
    const isFiltered = tagsFilter.includes(tag);
    return (
      <TagSelectStyled
        key={key}
        tag={tag}
        ariaLabel={
          isSelected
            ? tt('aria_label.cancel_sort_by_tag', { tag })
            : tt('aria_label.sort_by_tag', { tag })
        }
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
        {/* <SearchTagsWrapper>
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
                </SearchTagsWrapper> */}

        <Title>{tt('tags.popularTags')}</Title>
        <TagsWrapper>{tags.map(this.renderTag)}</TagsWrapper>
        {collapsed ? (
          <Title role="button" onClick={this.onToggleClick}>
            {tt('tags.show_more_tags')}
            <CollapseIcon />
          </Title>
        ) : (
          <Button auto onClick={this.onToggleClick}>
            {tt('g.collapse')}
          </Button>
        )}

        {/* {!collapsed && <ButtonLink to="/tags">Показать все</ButtonLink>} */}
      </Wrapper>
    );
  }
}
