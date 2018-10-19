import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TagsCard from 'src/app/components/home/sidebar/TagsCard';

const Wrapper = styled.div``;

export default class HomeSidebar extends Component {
    static propTypes = {
    };

    render() {
        return (
            <Wrapper>
                <TagsCard />
            </Wrapper>
        );
    }
}
