import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Userpic from '../../../../app/components/elements/Userpic';

const Wrapper = styled.div`
    display: flex;
    height: 128px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const AvatarBlock = styled.div`
    display: flex;
`;

class AboutPanel extends Component {
    static propTypes = {};

    static defaultProps = {};

    render() {
        const { post } = this.props;
        const { author: postAuthor} = post;
        console.log(post);
        return (
            <Wrapper>
                <AvatarBlock>
                    <Userpic account={postAuthor} size={50} />
                </AvatarBlock>
            </Wrapper>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {};
};

const mapDispatchToProps = (dispatch, props) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AboutPanel);
