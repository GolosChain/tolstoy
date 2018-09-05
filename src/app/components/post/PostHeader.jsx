import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div``;

class PostHeader extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
    };

    static defaultProps = {};

    render() {
        const { post, className } = this.props;
        return <Wrapper className={className} />;
    }
}

export default PostHeader;
