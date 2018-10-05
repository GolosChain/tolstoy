import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router';
import tt from 'counterpart';
import { FormattedDate } from 'react-intl';

import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';

import Userpic from 'app/components/elements/Userpic';
import Follow from 'src/app/components/common/Follow/Follow';
import { aboutPanelSelector } from 'src/app/redux/selectors/post/aboutPanel';
import user from 'app/redux/User';
import { LIQUID_TICKER } from 'app/client_config';

const Wrapper = styled.div`
    display: flex;
    padding: 20px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Avatar = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
    padding-left: 20px;

    @media (max-width: 768px) {
        padding-left: 0;
    }
`;

const Names = styled.div`
    padding: 0 20px 0 10px;
`;

const Name = styled.div`
    color: #393636;
    font-family: 'Open Sans', sans-serif;
    font-size: 24px;
    font-weight: bold;
    line-height: 25px;
`;

const Account = styled(Link)`
    display: inline-block;
    padding: 0 10px;
    margin-left: -10px;
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    line-height: 25px;
`;

const Divider = styled.div`
    width: 1px;
    height: 89px;
    background: #e1e1e1;

    @media (max-width: 768px) {
        display: none;
    }
`;

const CakeText = styled.div`
    padding-top: 14px;
`;

const AboutText = styled.div``;

const Cake = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-grow: 2;

    padding: 0 20px;

    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    letter-spacing: -0.26px;
    line-height: 24px;
    ${CakeText}, ${AboutText} {
        color: #959595;
    }

    @media (max-width: 768px) {
        margin-top: 20px;
        padding: 0;
    }
`;

const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-direction: column;
    flex-grow: 1;
`;

const ButtonInPanel = styled(Button)`
    min-width: 167px;
    width: 167px;
    text-transform: uppercase;

    svg {
        min-width: 17px;
        min-height: 15px;
    }

    @media (max-width: 768px) {
        width: 100%;
        margin-top: 20px;
    }
`;

const FollowButton = styled(Follow)`
    min-width: 167px;
    min-height: 34px;

    @media (max-width: 768px) {
        width: 100%;
        margin-top: 20px;
    }
`;

@connect(
    aboutPanelSelector,
    dispatch => ({
        showTransfer(account, url) {
            dispatch(
                user.actions.setTransferDefaults({
                    flag: {
                        type: `donate`,
                        fMemo: () => JSON.stringify({ donate: { post: url } }),
                    },
                    to: account,
                    asset: LIQUID_TICKER,
                    transferType: 'Transfer to Account',
                    disableMemo: false,
                    disableTo: true,
                })
            );
            dispatch(user.actions.showTransfer());
        },
    })
)
export default class AboutPanel extends Component {
    render() {
        const { name, account, about, created } = this.props;
        return (
            <Wrapper>
                <Avatar>
                    <Userpic account={account} size={50} />
                    <Names>
                        <Name>{name}</Name>
                        <Account to={`/@${account}`}>@{account}</Account>
                    </Names>
                    <Divider />
                </Avatar>
                <Cake>
                    {about ? (
                        <AboutText>{about}</AboutText>
                    ) : (
                        <Fragment>
                            <Icon width="36" height="34" name="cake" />
                            <CakeText>
                                {tt('on_golos_from')}
                                &nbsp;
                                <FormattedDate
                                    value={new Date(created)}
                                    month="long"
                                    year="numeric"
                                />
                            </CakeText>
                        </Fragment>
                    )}
                </Cake>
                <Buttons>
                    <ButtonInPanel light onClick={this.showTransferDialog}>
                        <Icon width="17" height="15" name="coins_plus" />
                        {tt('g.donate')}
                    </ButtonInPanel>
                    <FollowButton following={account} />
                </Buttons>
            </Wrapper>
        );
    }

    showTransferDialog = () => {
        const { showTransfer, account, url } = this.props;
        showTransfer(account, url);
    };
}
