import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'app/components/elements/Icon';
import Tag from 'golos-ui/Tag';
import { getFavoriteTags } from 'app/utils/tags';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 12px 0;
    margin-left: 20px;
    overflow: hidden;

    @media (max-width: 576px) {
        padding: 12px 16px;
        margin: 0;
        border-bottom: 1px solid #e9e9e9;
    }

    ${is('isEditMode')`
        margin: 0;
    `};
`;

const TagsLine = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const StyledTag = styled(Tag)`
    margin-bottom: 8px;
    cursor: pointer;
`;

const StyledIcon = styled(Icon)`
    display: inline-block;
    vertical-align: top;
    margin: -1px -2px 0 8px;
    color: #e2e2e2;
    transition: color 0.12s ease-in;
`;

const RecommendedTagsLabel = styled.h5`
    display: block;
    margin: 0;
    padding: 12px 0;
    font-size: 15px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #959595;

    @media (min-width: 577px) {
        display: none;
    }
`;

export default class TagsEditLine extends PureComponent {
    static propTypes = {
        tags: PropTypes.arrayOf(PropTypes.string).isRequired,
        inline: PropTypes.bool,
        editMode: PropTypes.bool,
        hidePopular: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
    };

    state = {
        favoriteTags: [],
    };

    componentDidMount() {
        this.setState({
            favoriteTags: getFavoriteTags(),
        });
    }

    render() {
        const { hidePopular, editMode } = this.props;

        return (
            <Wrapper isEditMode={editMode}>
                {this._renderTagList()}
                {hidePopular ? null : this._renderPopularList()}
            </Wrapper>
        );
    }

    _renderTagList() {
        const { tags } = this.props;

        return <TagsLine>{tags.map((tag, i) => this._renderTag(tag, i))}</TagsLine>;
    }

    _renderTag(tag, i) {
        return (
            <StyledTag key={tag} selected data-tag={tag} onClick={() => this._removeTag(tag)}>
                {tag}
                <StyledIcon name="editor/cross" size="0_75x" />
            </StyledTag>
        );
    }

    _renderPopularList() {
        const { tags } = this.props;
        const { favoriteTags } = this.state;

        const favorites = favoriteTags.filter(tag => !tags.includes(tag));

        if (!favorites.length) {
            return null;
        }

        return (
            <Fragment>
                <RecommendedTagsLabel>{tt('post_editor.recommended_tags')}</RecommendedTagsLabel>
                <TagsLine>
                    {favorites.map(tag => (
                        <StyledTag key={tag} onClick={() => this._onAddPopularTag(tag)}>
                            {tag}
                            <StyledIcon name="editor/plus" size="0_75x" />
                        </StyledTag>
                    ))}
                </TagsLine>
            </Fragment>
        );
    }

    _removeTag = tag => {
        const { tags } = this.props;
        this.props.onChange(tags.filter(t => t !== tag));
    };

    _onAddPopularTag = tag => {
        const { tags } = this.props;

        if (!tags.includes(tag)) {
            this.props.onChange([...tags, tag]);
        }
    };
}
