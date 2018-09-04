import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Container from 'src/app/components/common/Container/Container';
import SidePanel from 'src/app/containers/Post/SidePanel';

const Wrapper = Container.extend``;
const Content = styled.div``;
const ActivePanel = styled.div``;
const AboutPanel = styled.div``;
const SidePanelWrapper = styled(SidePanel)`
    position: fixed;
    bottom: 30px;
    left: calc(50% - 684px);

    @media (max-width: 1407px) {
        display: none;
    }
`;

class Post extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Wrapper>
                <Content>test</Content>
                <ActivePanel />
                <AboutPanel />
                <SidePanelWrapper />
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
)(Post);
