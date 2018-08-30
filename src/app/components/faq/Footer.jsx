import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Container from '../Container/Container';
import tt from 'counterpart';

const Wrapper = Container.extend.attrs({
    justify: 'space-between',
    align: 'center',
})`
    background: #ffffff;
    padding: 20px 64px;

    @media (max-width: 830px) {
        padding: 0;
        flex-direction: column;
        margin-bottom: 40px;
    }
`;

const Text = styled.p`
    width: 50%;
    color: #393636;
    margin: 0;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.26px;
    text-align: left;

    @media (max-width: 830px) {
        width: 100%;
        max-width: 600px;
        padding: 40px 24px 20px 24px;
    }
`;

const Image = styled.div`
    flex-grow: 1;
    height: 177px;
    background: url('/images/new/faq/footer.svg') 53% 50% no-repeat;
    background-size: 242px 177px;

    @media (max-width: 830px) {
        width: 100%;
        height: 238px;
        background-position: center;
        background-size: auto 238px;
    }

    @media (max-width: 430px) {
        height: 73vw;
        background-size: 80vw 73vw;
    }
`;

export default class Footer extends PureComponent {
    state = {
        footer_message: {
            __html: tt('faq_jsq.footer_message'),
        },
    };

    render() {
        return (
            <Wrapper>
                <Text dangerouslySetInnerHTML={this.state.footer_message} />
                <Image />
            </Wrapper>
        );
    }
}
