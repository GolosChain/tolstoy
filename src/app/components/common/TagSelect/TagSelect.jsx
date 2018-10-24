import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import Tag from 'golos-ui/Tag';
import Popover from 'src/app/components/common/Popover';

const SLIDER_OFFSET = 8;

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    position: relative;
`;

const TagStyled = styled(Tag)`
    cursor: pointer;
`;

const TooltipWrapper = styled.div`
    display: flex;
    flex: 1;
    height: 40px;
    width: 100%;
    min-width: 174px;
    margin: 0 -${SLIDER_OFFSET}px;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    background: #fff;
    animation: from-down 0.2s;
`;

const Action = styled.div`
    position: relative;
    flex: 1;
    padding: 0 14px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.67;
    color: #2879ff;
    cursor: pointer;

    ${is('active')`
        color: #959595;
    `};

    ${is('remove')`
        color: #fc5d16;
    `};

    &:not(last-child) {
        &:after {
            position: absolute;
            content: '';
            right: 0;
            top: 0;
            bottom: 0;
            width: 1px;
            background: #f1f1f1;
        }
    }
`;

export default class SelectTag extends Component {
    static propTypes = {
        tag: PropTypes.string,
        onTagClick: PropTypes.func,
        onlyRemove: PropTypes.bool,
        className: PropTypes.string,
    };

    static defaultProps = {
        onlyRemove: false,
    };

    popoverRef = createRef();

    handleTagClick = action => () => {
        this.props.onTagClick(this.props.tag, action);
        this.popoverRef.current.close();
    };

    renderActions = () => {
        const { isSelected, isFiltered, onlyRemove } = this.props;

        return (
            <TooltipWrapper>
                {onlyRemove ? (
                    <Action
                        onClick={this.handleTagClick(isSelected ? 'select' : 'filter')}
                        remove={true}
                    >
                        Удалить
                    </Action>
                ) : (
                    [
                        <Action
                            key="exclude"
                            onClick={this.handleTagClick('filter')}
                            active={isFiltered}
                        >
                            Исключить
                        </Action>,
                        <Action
                            key="add"
                            onClick={this.handleTagClick('select')}
                            active={isSelected}
                        >
                            Добавить
                        </Action>,
                    ]
                )}
            </TooltipWrapper>
        );
    };

    render() {
        const { tag, isSelected, isFiltered, className } = this.props;

        return (
            <Wrapper className={className}>
                <Popover innerRef={this.popoverRef} content={this.renderActions}>
                    <TagStyled selected={isSelected ? 1 : 0} filtered={isFiltered ? 1 : 0}>
                        {tag}
                    </TagStyled>
                </Popover>
            </Wrapper>
        );
    }
}
