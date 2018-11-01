import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map } from 'immutable';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import SlideContainer from 'src/app/components/common/SlideContainer';
import TagSelect from 'src/app/components/common/TagSelect';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    @media (max-width: 500px) {
        display: none;
    }
`;

const Title = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;

    line-height: 1;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.7px;
    color: #333333;
    text-transform: uppercase;

    margin-bottom: 20px;
`;

const TagSelectStyled = styled(TagSelect)`
    @media (max-width: 768px) {
        margin-bottom: 0;
    }
`;

const Tags = styled.div`
    display: flex;

    @media (min-width: 768px) {
        flex-wrap: wrap;
    }
`;

const IconCross = styled(Icon).attrs({
    name: 'cross_thin',
    size: 14,
})`
    cursor: pointer;
`;

export default class TagsBox extends Component {
    static propTypes = {
        // connect
        category: PropTypes.string,
        order: PropTypes.string,
        currentUsername: PropTypes.string,
        selectedFilterTags: PropTypes.array,
        deleteTag: PropTypes.func,
        clearTags: PropTypes.func,
        loadMore: PropTypes.func,
    };

    loadMore = () => {
        const { category, order, currentUsername, loadMore } = this.props;
        loadMore({ category, order, accountname: currentUsername });
    };

    handleTagClick = tag => {
        const { deleteTag } = this.props;

        deleteTag(tag);
        this.loadMore();
    };

    handleClearClick = () => {
        const { clearTags } = this.props;

        clearTags();
        this.loadMore();
    };

    render() {
        const { selectedSelectTags, selectedFilterTags } = this.props;

        if (!selectedSelectTags.length && !selectedFilterTags.length) {
            return null;
        }

        return (
            <Wrapper>
                <Title>
                    {tt('tags.selectedTags')} <IconCross onClick={this.handleClearClick} />
                </Title>

                <SlideContainer>
                    <Tags>
                        {selectedSelectTags.map((tag, key) => (
                            <TagSelectStyled
                                key={key}
                                tag={tag}
                                isSelected
                                onlyRemove
                                onTagClick={this.handleTagClick}
                            />
                        ))}
                        {selectedFilterTags.map((tag, key) => (
                            <TagSelectStyled
                                key={key}
                                tag={tag}
                                isFiltered
                                onlyRemove
                                onTagClick={this.handleTagClick}
                            />
                        ))}
                    </Tags>
                </SlideContainer>
            </Wrapper>
        );
    }
}
