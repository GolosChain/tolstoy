import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map } from 'immutable';
import tt from 'counterpart';

import SlideContainer from 'src/app/components/common/SlideContainer';
import TagSelect from 'src/app/components/common/TagSelect';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

const Title = styled.div`
    position: relative;
    line-height: 1;
    font-size: 12px;
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

export default class TagsBox extends Component {
    static propTypes = {
        selectedTags: PropTypes.instanceOf(Map),
    };

    onTagClick = tag => {
        const { selectedTags, setSettingsOptions, loadMore, order } = this.props;

        setSettingsOptions({
            basic: {
                selectedTags: selectedTags.delete(tag),
            },
        });
        loadMore({ order });
    };

    render() {
        const { selectedSelectTags, selectedFilterTags } = this.props;

        if (!selectedSelectTags.length && !selectedFilterTags.length) {
            return null;
        }

        return (
            <Wrapper>
                <Title>{tt('tags.selectedTags')}</Title>

                <SlideContainer>
                    <Tags>
                        {selectedSelectTags.map((tag, key) => (
                            <TagSelectStyled
                                key={key}
                                tag={tag}
                                isSelected
                                onlyRemove
                                onTagClick={this.onTagClick}
                            />
                        ))}
                        {selectedFilterTags.map((tag, key) => (
                            <TagSelectStyled
                                key={key}
                                tag={tag}
                                isFiltered
                                onlyRemove
                                onTagClick={this.onTagClick}
                            />
                        ))}
                    </Tags>
                </SlideContainer>
            </Wrapper>
        );
    }
}
