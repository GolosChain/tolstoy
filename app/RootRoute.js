import loadable from 'loadable-components';

import App from 'app/components/App';
import PostsIndex from '@pages/PostsIndex';
import resolveRoute from './ResolveRoute';

export default {
    path: '/',
    component: App,
    indexRoute: {
        component: PostsIndex.component,
    },
    getChildRoutes(nextState, cb) {
        const route = resolveRoute(nextState.location.pathname);
        if (route.page === 'XSSTest' && process.env.NODE_ENV === 'development') {
            cb(null, [require('@pages/XSS').default]);
        } else if (route.page === 'Tags') {
            cb(null, [require('@pages/TagsIndex').default]);
        } else if (route.page === 'CreateAccountTestnet') {
            cb(null, [require('@pages/CreateAccountTestnet').default]);
        } else if (route.page === 'UserProfile') {
            cb(null, [require('src/app/containers/userProfile').UserProfileContainer]);
        } else if (route.page === 'Post') {
            cb(null, [require('@pages/PostPage').default]);
        } else if (route.page === 'PostNoCategory') {
            cb(null, [require('@pages/PostPageNoCategory').default]);
        } else if (route.page === 'PostsIndex') {
            cb(null, [PostsIndex]);
        } else {
            cb(null, [
                {
                    path: 'login.html',
                    component: loadable(() => import('app/components/pages/Login'))
                },
                {
                    path: 'change_password',
                    component: loadable(() => import('app/components/pages/ChangePasswordPage'))
                },
                {
                    path: 'create_account',
                    component: loadable(() => import('app/components/pages/CreateAccount'))
                },
                {
                    path: 'leave_page',
                    component: loadable(() => import('app/components/pages/LeavePage'))
                },
                {
                    path: 'submit',
                    component: loadable(() => import('app/components/pages/SubmitPost'))
                },
                {
                    path: 'recover_account_step_1',
                    component: loadable(() => import('app/components/pages/RecoverAccountStep1'))
                },
                {
                    path: 'recover_account_step_2',
                    component: loadable(() => import('app/components/pages/RecoverAccountStep2'))
                },
                {
                    path: '~witnesses',
                    component: loadable(() => import('app/components/pages/Witnesses'))
                },
                {
                    path: 'market',
                    component: loadable(() => import('app/components/pages/Market')),
                },
                {
                    path: 'start',
                    component: loadable(() => import('app/components/pages/Landings/Start')),
                },
                {
                    path: 'faq',
                    component: loadable(() => import('app/components/pages/Faq')),
                },
                {
                    path: 'about',
                    component: loadable(() => import('app/components/pages/Landing')),
                },
                {
                    path: 'welcome',
                    component: loadable(() => import('src/app/containers/Welcome')),
                },
                {
                    component: require('@pages/NotFound').default
                }
            ]);
        }
    },
};
