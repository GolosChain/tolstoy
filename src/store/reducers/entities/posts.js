import { path } from 'ramda';
import update from 'immutability-helper';

import { SET_POST_VOTE } from 'src/store/constants';
import { formatContentId } from 'src/store/schemas/gate';
import { mergeEntities } from 'src/utils/store';

const initialState = {};

export default function(state = initialState, { type, payload }) {
  const entities = path(['entities', 'posts'], payload);

  if (entities) {
    /* Merge используется из-за того что посты в ленте и отдельным постом приходят с разными структурами данных в поле content:
     * {
     *   "body": {
     *     "preview": "<SHORT PREVIEW>"
     *   },
     *   "title": "..."
     * }
     * а при запросе поста структура иная:
     * {
     *   "body": {
     *     "full": "<FULL HTML>"
     *   },
     *   "title": "..."
     * }
     * и нужно сохранить оба поля в сторе.
     */
    return mergeEntities(state, entities, {
      transform: post => ({
        type: 'post',
        ...post,
        id: formatContentId(post.contentId),
      }),
      merge: (cachedPost, newPost) =>
        update(newPost, {
          content: {
            body: {
              $merge: cachedPost.content.body,
            },
          },
        }),
    });
  }

  switch (type) {
    case SET_POST_VOTE:
      if (state[payload.id]) {
        return update(state, {
          [payload.id]: {
            votes: {
              $set: payload.votes,
            },
          },
        });
      }
      return state;
    default:
      return state;
  }
}
