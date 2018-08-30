import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Flex from '../Flex/Flex';
import ChannelsCard from './ChannelsCard';
import PropTypes from 'prop-types';
import Container from '../Container/Container';
import tt from 'counterpart';

const ChannelsList = styled.div`
    background-color: #f9f9f9;
`;

const Wrapper = Container.extend`
    padding: 60px 24px;

    @media (max-width: 1200px) {
        padding: 40px 0;
    }
`;

const Title = styled.p`
    color: #2d2d2d;
    font-family: 'Open Sans', sans-serif;
    font-size: 34px;
    font-weight: bold;
    letter-spacing: 0.37px;
    line-height: 41px;
    margin-bottom: 40px;

    @media (max-width: 1200px) {
        text-align: center;
    }

    @media (max-width: 744px) {
        font-size: 30px;
    }
`;

const CardsWrapper = Flex.extend.attrs({
    justify: 'flex-start',
    wrap: 'wrap',
})`
    margin: -10px;
`;

export default class Channels extends PureComponent {
    static propTypes = {
        channels: PropTypes.arrayOf(PropTypes.object),
    };

    static defaultProps = {
        channels: [],
    };

    render() {
        const { channels } = this.props;

        return (
            <ChannelsList>
                <Wrapper column>
                    <Title>{tt('faq_jsq.official_channels')}</Title>
                    <CardsWrapper>
                        {channels.map((channel, index) => {
                            return (
                                <ChannelsCard key={index} channel={channel} />
                            );
                        })}
                    </CardsWrapper>
                </Wrapper>
            </ChannelsList>
        );
    }
}
