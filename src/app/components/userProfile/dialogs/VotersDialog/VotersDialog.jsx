import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Set } from 'immutable';
import styled from 'styled-components';
import { Link } from 'react-router';

import Icon from 'golos-ui/Icon';

import normalizeProfile from 'app/utils/NormalizeProfile';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import Avatar from 'src/app/components/common/Avatar';
import Follow from 'src/app/components/common/Follow';
import { votersDialogSelector } from 'src/app/redux/selectors/dialogs/votesDialog';
import { getVoters } from 'src/app/redux/actions/vote';

const Dialog = styled.div`
    position: relative;
    flex-basis: 800px;
    color: #333;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 19px 3px rgba(0, 0, 0, 0.2);

    @media (max-width: 890px) {
        min-width: unset;
        max-width: unset;
        width: 100%;
    }
`;

const IconClose = styled(Icon).attrs({
    name: 'cross',
    size: 30,
})`
    position: absolute;
    right: 8px;
    top: 8px;
    padding: 8px;
    text-align: center;
    color: #e1e1e1;
    cursor: pointer;
    transition: color 0.1s;

    &:hover {
        color: #000;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    border-radius: 8px 8px 0 0;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const Title = styled.div`
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
`;

const Content = styled.div`
    position: relative;
    padding: 20px;
`;

const UserItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;

    &:first-child {
        margin-top: 0;
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const UserLink = styled(Link)`
    display: flex;
    align-items: center;
`;

const Name = styled.div`
    color: #393636;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.4px;
    line-height: 18px;
    margin-left: 9px;
`;

const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90px;
    opacity: 0;
    animation: fade-in 0.25s forwards;
    animation-delay: 0.25s;
`;

@connect(
    votersDialogSelector,
    {
        getVoters,
    }
)
export default class VotersDialog extends PureComponent {
    static propTypes = {
        onRef: PropTypes.func.isRequired,

        loading: PropTypes.bool,
        users: PropTypes.instanceOf(Set),
    };

    rootRef = null;

    componentDidMount() {
        this.props.onRef(this);
        this.props.getVoters(this.props.postLink, 20);
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    setRootRef = el => (this.rootRef = el);

    render() {
        const { loading, users } = this.props;
        if (!users) return null;
        return (
            <Dialog>
                <Header>
                    <Title>Like/dislike</Title>
                    <IconClose onClick={this.props.onClose} />
                </Header>
                <Content innerRef={this.setRootRef}>
                    {users.map(user => {
                        const profile = normalizeProfile(user.toJS());

                        return (
                            <UserItem key={user.get('name')}>
                                <UserLink
                                    to={`/@${user.get('name')}`}
                                    title={user.get('name')}
                                    onClick={this.props.onClose}
                                >
                                    <Avatar avatarUrl={profile.profile_image} />
                                    <Name>{profile.name || user.get('name')}</Name>
                                </UserLink>
                                <Follow following={user.get('name')} />
                            </UserItem>
                        );
                    })}
                    {loading && (
                        <LoaderWrapper>
                            <LoadingIndicator type="circle" size={40} />
                        </LoaderWrapper>
                    )}
                </Content>
            </Dialog>
        );
    }
}
