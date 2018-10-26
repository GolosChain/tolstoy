import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Seq } from 'immutable';

import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import Avatar from 'src/app/components/common/Avatar';
import Follow from 'src/app/components/common/Follow';
import { votersDialogSelector } from 'src/app/redux/selectors/dialogs/votesDialog';
import { getVoters } from 'src/app/redux/actions/vote';
import {
    Dialog,
    Header,
    Title,
    IconClose,
    Content,
    UserItem,
    UserLink,
    Name,
    LoaderWrapper,
} from 'src/app/components/userProfile/dialogs/FollowersDialog/FollowersDialog';

const ShowAll = styled.button`
    width: 100%;
    height: 50px;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.15);
    background-color: #ffffff;

    color: #111111;
    font-size: 14px;
    font-weight: bold;
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

        loading: PropTypes.bool.isRequired,
        users: PropTypes.instanceOf(Seq),
        username: PropTypes.string.isRequired,
    };

    rootRef = null;

    componentDidMount() {
        this.props.onRef(this);
        this.props.getVoters(this.props.postLink, 50);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.users.length === 0 && nextProps.hasMore) {
            this.props.getVoters(this.props.postLink);
        }
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    showAll = () => {
        this.props.getVoters(this.props.postLink);
    };

    setRootRef = el => (this.rootRef = el);

    render() {
        const { loading, users, hasMore, username } = this.props;
        return (
            <Dialog>
                <Header>
                    <Title>Like/dislike</Title>
                    <IconClose onClick={this.props.onClose} />
                </Header>
                <Content innerRef={this.setRootRef}>
                    {users.map(user => (
                        <UserItem key={user.name}>
                            <UserLink
                                to={`/@${user.name}`}
                                title={user.name}
                                onClick={this.props.onClose}
                            >
                                <Avatar avatarUrl={user.avatar} />
                                <Name>{user.name}</Name>
                            </UserLink>
                            {user.name !== username ? <Follow following={user.name} /> : null}
                        </UserItem>
                    ))}
                    {loading && (
                        <LoaderWrapper>
                            <LoadingIndicator type="circle" size={40} />
                        </LoaderWrapper>
                    )}
                </Content>
                {hasMore && !loading && users.length > 0 ? (
                    <ShowAll onClick={this.showAll}>показать все</ShowAll>
                ) : null}
            </Dialog>
        );
    }
}
