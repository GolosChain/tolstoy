import resolveRoute from './ResolveRoute';

import App from 'src/app/containers';
import HomeContainer from 'src/app/containers/home';
import HomeContent from 'src/app/containers/home/content';
import HomeSidebar from 'src/app/containers/home/sidebar';

export default {
    path: '/',
    component: App,
    getChildRoutes(nextState, cb) {
        const route = resolveRoute(nextState.location.pathname);
        if (route.page === 'PostsIndex') {
            cb(null, [
                {
                    component: HomeContainer,
                    indexRoute: {
                        components: {
                            content: HomeContent,
                            sidebar: HomeSidebar,
                        },
                    },
                    childRoutes: [
                        {
                            path: '/:order(/:category)',
                            components: {
                                content: HomeContent,
                                sidebar: HomeSidebar,
                            },
                        },
                    ],
                },
            ]);
        } else if (route.page === 'UserProfile') {
            cb(null, [require('src/app/containers/userProfile').UserProfileContainer]);
        } else if (route.page === 'Post') {
            cb(null, [
                {
                    path: '/(:category/)@:username/:slug(/:action)',
                    component: require('src/app/containers/post').default,
                },
            ]);
        } else if (route.page === 'Landing') {
            cb(null, [require('@pages/Landing').default]);
        } else if (route.page === 'Welcome') {
            cb(null, [
                {
                    path: 'welcome',
                    component: process.env.BROWSER
                        ? require('@pages/WelcomeLoader').default
                        : require('@pages/Welcome').default,
                },
            ]);
        } else if (route.page === 'Start') {
            cb(null, [require('@pages/Landings/Start').default]);
        } else if (route.page === 'Faq') {
            cb(null, [
                {
                    path: 'faq',
                    component: process.env.BROWSER
                        ? require('@pages/FaqLoader').default
                        : require('@pages/Faq').default,
                },
            ]);
        } else if (route.page === 'Login') {
            cb(null, [
                {
                    path: 'login',
                    component: require('src/app/containers/login').default,
                },
            ]);
        } else if (route.page === 'Privacy') {
            cb(null, [require('@pages/Privacy').default]);
        } else if (route.page === 'Support') {
            cb(null, [require('@pages/Support').default]);
        } else if (route.page === 'XSSTest' && process.env.NODE_ENV === 'development') {
            cb(null, [require('@pages/XSS').default]);
        } else if (route.page === 'Tags') {
            cb(null, [require('@pages/TagsIndex').default]);
        } else if (route.page === 'Tos') {
            cb(null, [require('@pages/Tos').default]);
        } else if (route.page === 'ChangePassword') {
            cb(null, [require('@pages/ChangePasswordPage').default]);
        } else if (route.page === 'RecoverAccountStep1') {
            cb(null, [require('@pages/RecoverAccountStep1').default]);
        } else if (route.page === 'RecoverAccountStep2') {
            cb(null, [require('@pages/RecoverAccountStep2').default]);
        } else if (route.page === 'Witnesses') {
            cb(null, [require('@pages/WitnessesLoader').default]);
        } else if (route.page === 'LeavePage') {
            cb(null, [require('@pages/LeavePage').default]);
        } else if (route.page === 'SubmitPost') {
            if (process.env.BROWSER) cb(null, [require('@pages/SubmitPost').default]);
            else cb(null, [require('@pages/SubmitPostServerRender').default]);
        } else if (route.page === 'Market') {
            cb(null, [require('@pages/MarketLoader').default]);
        } else if (route.page === 'PostNoCategory') {
            cb(null, [require('@pages/PostPageNoCategory').default]);
        } else {
            cb(process.env.BROWSER ? null : Error(404), [require('@pages/NotFound').default]);
        }
    },
};
