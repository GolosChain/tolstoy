import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import Tag from 'golos-ui/Tag';

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
    position: absolute;
    display: flex;
    height: 40px;
    top: -50px;
    left: 0;
    width: 100%;
    min-width: 174px;
    margin: 0 -${SLIDER_OFFSET}px;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    background: #fff;
    animation: from-down 0.2s;
`;

const TooltipBody = styled.div`
    display: flex;
    flex: 1;
`;

const TooltipTip = styled.div`
    position: absolute;
    bottom: 0;
    left: ${props => props.left || '50%'};
    margin-left: -5px;
    margin-bottom: -5px;
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    background: #fff;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.1);
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
    };

    static defaultProps = {
        onlyRemove: false,
    };

    state = {
        showActions: false,
        currentTag: '',
    };

    rootRef = createRef();
    tagRef = createRef();

    toggleShowActions = () => this.setState({ showActions: !this.state.showActions });

    handleTagClick = action => () => {
        this.props.onTagClick(this.props.tag, action);
        this.toggleShowActions();
    };

    renderActions() {
        const { isSelected, isFiltered, onlyRemove } = this.props;
        const box = this.rootRef.current.getBoundingClientRect();
        const tagBox = this.tagRef.current.getBoundingClientRect();

        const tipLeft = SLIDER_OFFSET + (tagBox.left - box.left + tagBox.width / 2);

        return (
            <TooltipWrapper>
                <TooltipBody>
                    {onlyRemove ? (
                        <Action onClick={this.handleTagClick(isSelected ? 'select' : 'filter')} remove={true}>
                            Удалить
                        </Action>
                    ) : (
                        [
                            <Action key="exclude" onClick={this.handleTagClick('filter')} active={isFiltered}>
                                Исключить
                            </Action>,
                            <Action key="add" onClick={this.handleTagClick('select')} active={isSelected}>
                                Добавить
                            </Action>,
                        ]
                    )}
                </TooltipBody>
                <TooltipTip left={`${tipLeft}px`} />
            </TooltipWrapper>
        );
    }

    render() {
        const { tag, isSelected, isFiltered } = this.props;
        const { showActions } = this.state;

        return (
            <Wrapper innerRef={this.rootRef}>
                <TagStyled
                    onClick={this.toggleShowActions}
                    selected={isSelected ? 1 : 0}
                    filtered={isFiltered ? 1 : 0}
                    innerRef={this.tagRef}
                >
                    {tag}
                </TagStyled>
                {showActions && this.renderActions()}
            </Wrapper>
        );
    }
}
