import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

if (process.env.BROWSER) {
    const files = require.context('!svg-sprite-loader!./assets', false, /.*\.svg$/);
    files.keys().forEach(files);
}

const Svg = styled.svg`
    min-width: ${({width}) => width}; 
    min-height: ${({height}) => height}; 
`;

const Icon = ({ name, size, height, width, ...props }) => {
    props.height = size || height;
    props.width = size || width;

    return (
        <Svg { ...props }>
            <use xlinkHref={`#${name}`} />
        </Svg>
    );
};

Icon.propTypes = {
    name: PropTypes.string,
    size: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

Icon.defaultProps = {
    height: '24',
    width: '24',
};

export default styled(Icon)``;
