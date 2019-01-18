import React, { PureComponent } from 'react';

import Icon from 'golos-ui/Icon';

const ReadOnlyBlock = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    left: 0;
    right: 0;
    bottom: 0;
    min-height: 56px;
    padding: 10px 26px;
    text-align: center;
    font-size: 15px;
    color: #fff;
    background: #2879ff;
    z-index: 15;
`;

const ReadOnlyContent = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    max-width: 1150px;
    margin: 0 auto;
    user-select: none;
    @media (max-width: 500px) {
        padding-right: 20px;
    }
`;

const ReadOnlyCloseWrapper = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    right: 0;
    bottom: 0;
`;

const ReadOnlyClose = styled.div`
    padding: 12px;
    margin-right: -12px;
    cursor: pointer;
`;

const IconClose = styled(Icon)`
    display: block;
    width: 15px;
    height: 15px;
`;

export class ReadOnlyWarning extends PureComponent {
    onCloseClick = () => {
        this.setState({
            hide: true,
        });
    };

    render() {
        const { hide } = this.state;

        if (hide) {
            return null;
        }

        return (
            <ReadOnlyBlock>
                <ReadOnlyContent>
                    Сайт работает в режиме только на чтение.
                    <ReadOnlyCloseWrapper>
                        <ReadOnlyClose onClick={this.onCloseClick}>
                            <IconClose name="cross" />
                        </ReadOnlyClose>
                    </ReadOnlyCloseWrapper>
                </ReadOnlyContent>
            </ReadOnlyBlock>
        );
    }
}
