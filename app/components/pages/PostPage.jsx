import Post from 'src/app/containers/Post/Post';

export default {
    path: '/(:category/)@:username/:slug',
    component: Post
};
