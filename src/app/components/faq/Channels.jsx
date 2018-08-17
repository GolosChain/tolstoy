import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Flex from '../Flex/Flex';
import ChannelsCard from './ChannelsCard';
import PropTypes from 'prop-types';

const Wrapper = Flex.extend.attrs({
    justify: 'center',
})`
    background-color: #f9f9f9;
`;

const ChannelsList = styled.div`
    max-width: 1200px;
    background-color: #f8f8f8;
    width: 100%;
    padding: 60px 24px;
`;

const Title = styled.p`
    color: #2d2d2d;
    font-family: 'Open Sans', sans-serif;
    font-size: 34px;
    font-weight: bold;
    letter-spacing: 0.37px;
    line-height: 41px;
    margin-bottom: 40px;
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
            <Wrapper justify="center">
                <ChannelsList>
                    <Title>Официальные каналы</Title>
                    <CardsWrapper>
                        {channels.map((channel, index) => {
                            return (
                                <ChannelsCard key={index} channel={channel} />
                            );
                        })}
                    </CardsWrapper>
                </ChannelsList>
            </Wrapper>
        );
    }
}
