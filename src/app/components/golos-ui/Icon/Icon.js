import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

if (process.env.BROWSER) {
    const files = require.context('!svg-sprite-loader!./assets', false, /.*\.svg$/);
    files.keys().forEach(files);
}

const Icon = ({ name, size, height, width, useMinSizes, ...props }) => {
    props.height = size || height;
    props.width = size || width;

    return (
        <svg {...props} style={useMinSizes ? { minWidth: width, minHeight: height } : {}}>
            <use xlinkHref={`#${name}`} />
        </svg>
    );
};

Icon.propTypes = {
    name: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    useMinSizes: PropTypes.bool,
};

Icon.defaultProps = {
    height: '24',
    width: '24',
    useMinSizes: false,
};

export default styled(Icon)``;
