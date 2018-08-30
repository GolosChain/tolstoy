import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import Icon from '../golos-ui/Icon/Icon';
import PropTypes from 'prop-types';

const LinkTo = ({ children, className, link }) => {
    return (
        <Link to={link} target="_blank" className={className}>
            {children}
        </Link>
    );
};

const Card = styled(LinkTo)`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 214px;
    height: 80px;
    padding: 0 20px;
    border-radius: 8.53px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    margin: 10px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    }

    @media (max-width: 744px) {
        flex-grow: 1;
        justify-content: center;
    }

    @media (max-width: 510px) {
        display: ${props => (props.showOnMobile ? 'flex' : 'none')};
    }
`;

const Text = styled.p`
    text-transform: uppercase;
    color: #393636;
    margin: 0 0 0 22px;
    font-size: 12px;
    font-family: 'Open Sans', sans-serif;
    letter-spacing: 0.37px;
    line-height: 18px;
    font-weight: bold;

    @media (max-width: 744px) {
        width: 150px;
    }
`;

const CustomIcon = Icon.extend`
    min-width: ${props => props.width}px;
`;

export default class ChannelsCard extends Component {
    static propTypes = {
        channel: PropTypes.shape({
            inscription: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
            width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            showOnMobile: PropTypes.bool.isRequired,
        }).isRequired,
    };
    render() {
        const {
            inscription,
            thumbnail,
            width,
            height,
            link,
            showOnMobile,
        } = this.props.channel;

        return (
            <Card link={link} showOnMobile={showOnMobile}>
                <CustomIcon name={thumbnail} width={width} height={height} />
                <Text>{inscription}</Text>
            </Card>
        );
    }
}
