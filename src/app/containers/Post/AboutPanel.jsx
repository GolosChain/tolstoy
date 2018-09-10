import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Userpic from '../../../../app/components/elements/Userpic';
import { Link } from 'react-router';
import Icon from '../../components/golos-ui/Icon/Icon';
import Button from '../../components/golos-ui/Button/Button';

const Wrapper = styled.div`
    display: flex;
    padding: 20px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const AvatarBlock = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
    padding-left: 20px;
`;

const NamesWrapper = styled.div`
    padding: 0 20px 0 10px;
`;

const RealName = styled(Link)`
    display: block;
    padding-bottom: 6px;
    margin-top: -6px;
    color: #393636;
    font-family: 'Open Sans', sans-serif;
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
`;

const UserName = styled.div`
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    line-height: 18px;
`;

const Divider = styled.div`
    width: 1px;
    height: 89px;
    background: #e1e1e1;
`;

const CakeBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-grow: 2;
`;

const CakeText = styled.div`
    padding-top: 14px;
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    letter-spacing: -0.26px;
    line-height: 24px;
`;

const ButtonBlock = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-direction: column;
    flex-grow: 1;
`;

const ButtonInPanel = Button.extend`
    width: 167px;
`;

class AboutPanel extends Component {
    static propTypes = {};

    static defaultProps = {};

    render() {
        const { author } = this.props;
        const accountUsername = author.account;
        return (
            <Wrapper>
                <AvatarBlock>
                    <Userpic account={accountUsername} size={50} />
                    <NamesWrapper>
                        <RealName to={`/@${accountUsername}`}>{author.name}</RealName>
                        <UserName>@{accountUsername}</UserName>
                    </NamesWrapper>
                    <Divider />
                </AvatarBlock>
                <CakeBlock>
                    <Icon width="36" height="34" name="cake" />
                    <CakeText>На Golos с сентября 2018</CakeText>
                </CakeBlock>
                <ButtonBlock>
                    <ButtonInPanel light>
                        <Icon width="17" height="15" name="coins_plus" />
                        отблагодарить
                    </ButtonInPanel>
                    <ButtonInPanel light>
                        <Icon width="10" height="10" name="cross" />
                        отписаться
                    </ButtonInPanel>
                </ButtonBlock>
            </Wrapper>
        );
    }
}

export default AboutPanel;
