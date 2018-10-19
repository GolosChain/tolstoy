import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List } from 'immutable';

import TagSelect from 'src/app/components/common/TagSelect';

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
`;

export default class TagsBox extends Component {
    static propTypes = {
        selectedSelectTags: PropTypes.instanceOf(List),
        selectedFilterTags: PropTypes.instanceOf(List),
    };

    onTagClick = (tag, action) => {
        const {
            selectedFilterTags,
            selectedSelectTags,
            setSettingsOptions,
            loadMore,
            order,
        } = this.props;

        const filterTagIndex = selectedFilterTags.indexOf(tag);
        const selectTagIndex = selectedSelectTags.indexOf(tag);

        const basic = {};

        if (action === 'filter') {
            if (filterTagIndex !== -1) {
                basic.selectedFilterTags = selectedFilterTags.remove(filterTagIndex);
            }
        } else if (action === 'select') {
            if (selectTagIndex !== -1) {
                basic.selectedSelectTags = selectedSelectTags.remove(selectTagIndex);
            }
        }

        setSettingsOptions({ basic });
        loadMore({ order });
    };

    render() {
        const { selectedSelectTags, selectedFilterTags } = this.props;

        return (
            <Wrapper>
                {selectedSelectTags.map((tag, key) => (
                    <TagSelect key={key} tag={tag} isSelected onlyRemove onTagClick={this.onTagClick} />
                ))}
                {selectedFilterTags.map((tag, key) => (
                    <TagSelect key={key} tag={tag} isFiltered onlyRemove onTagClick={this.onTagClick} />
                ))}
            </Wrapper>
        );
    }
}
