import UserProfile from './UserProfile';

export default {
  path: '@:accountName',
  component: UserProfile,
  getIndexRoute(nextState, cb) {
    cb(null, {
      components: {
        content: require('./blog/BlogContent').default,
        sidebarRight: require('../../components/userProfile/common/RightPanel').default,
      },
    });
  },
  childRoutes: [
    {
      path: 'comments',
      getComponents(nextState, cb) {
        cb(null, {
          content: require('./comments/CommentsContent').default,
          sidebarRight: require('../../components/userProfile/common/RightPanel').default,
        });
      },
    },
    {
      path: 'recent-replies',
      getComponents(nextState, cb) {
        cb(null, {
          content: require('./replies/RepliesContent').default,
          sidebarRight: require('../../components/userProfile/common/RightPanel').default,
        });
      },
    },
    {
      path: 'settings',
      getComponents(nextState, cb) {
        cb(null, {
          content: require('./settings/SettingsContent').default,
        });
      },
    },
    {
      path: 'transfers',
      getComponents(nextState, cb) {
        cb(null, {
          content: require('./wallet/WalletContent').default,
          sidebarRight: require('../../components/userProfile/common/RightPanel').default,
        });
      },
    },
    {
      path: 'activity',
      getComponents(nextState, cb) {
        cb(null, {
          content: require('./activity').default,
          sidebarRight: require('../../components/userProfile/common/RightPanel').default,
        });
      },
    },
    {
      path: 'favorites',
      getComponents(nextState, cb) {
        cb(null, {
          content: require('./favorites/FavoritesContent').default,
          sidebarRight: require('../../components/userProfile/common/RightPanel').default,
        });
      },
    },
    {
      path: 'messages',
      getComponents(nextState, cb) {
        cb(null, {
          content: require('../../../messenger/containers/Messenger').default,
        });
      },
    },
  ],
};
