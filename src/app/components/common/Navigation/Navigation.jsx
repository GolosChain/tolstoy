import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { TabLinkIndex } from 'golos-ui/Tab';
import SlideContainer from 'src/app/components/common/SlideContainer';
import {
    MAX_WIDTH,
    BASE_MARGIN,
    MOBILE_WIDTH,
    MOBILE_MARGIN,
} from 'src/app/components/common/Container';

const SlideContainerStyled = styled(SlideContainer)`
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const Container = styled.div`
    flex: 1 0;
    max-width: ${MAX_WIDTH}px;
    margin: 0 auto;

    @media (max-width: ${MAX_WIDTH + BASE_MARGIN * 2}px) {
        margin: 0;
        padding: 0 ${BASE_MARGIN}px;
    }

    @media (max-width: ${MOBILE_WIDTH}px) {
        padding: 0 ${MOBILE_MARGIN}px;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex: 1 0;
    margin: 0 -3px;
`;

const TabLinkStyled = styled(TabLinkIndex)`
    height: 50px;
    padding: 0 ${({ compact }) => (compact ? '6px' : '12px')};

    &.${({ activeClassName }) => activeClassName}:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: #333;
    }
`;
TabLinkStyled.defaultProps = {
    activeClassName: 'active',
};

const Right = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
`;

export default class Navigation extends PureComponent {
    static propTypes = {
        compact: PropTypes.bool,
        tabLinks: PropTypes.array.isRequired,
    };

    render() {
        const { tabLinks, rightItems, compact, location, className } = this.props;

        return (
            <SlideContainerStyled className={className}>
                <Container>
                    <Wrapper>
                        {tabLinks.map(({ value, to, index }) => (
                            <TabLinkStyled
                                key={to}
                                to={to}
                                compact={compact ? 1 : 0}
                                className={index && location === '/' ? 'active' : null}
                            >
                                {value}
                            </TabLinkStyled>
                        ))}
                        {rightItems ? <Right>{rightItems}</Right> : null}
                    </Wrapper>
                </Container>
            </SlideContainerStyled>
        );
    }
}
