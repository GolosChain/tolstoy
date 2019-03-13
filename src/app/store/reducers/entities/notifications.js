/* eslint-disable no-underscore-dangle */

import { path, map } from 'ramda';

import {
  AUTH_LOGOUT,
  CALL_MARK_AS_VIEWED_SUCCESS,
  CALL_MARK_ALL_AS_VIEWED_SUCCESS,
} from 'store/constants';
import { mergeEntities } from 'src/app/utils/store';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  const entities = path(['entities', 'notifications'], payload);

  if (entities) {
    return mergeEntities(state, entities, {
      transform: notification => {
        let data;

        // TODO: This is temporary transformation from legacy structures
        if (notification.fromUsers) {
          const actor = notification.fromUsers[0];

          data = {
            ...notification,
            id: notification._id,
            type: notification.eventType,
            community: {
              id: 'gls',
              name: 'Golos',
            },
            actor: {
              id: actor,
              name: actor,
              avatarUrl: null,
            },
            timestamp: notification.createdAt,
          };

          if (data.type === 'transfer') {
            data.value = {
              amount: data.amount,
              // TODO: Temp
              currency: 'GLS',
            };
          }
        } else {
          data = { ...notification };
        }

        if (data.permlink) {
          data.post = {
            contentId: {
              userId: 'unknown',
              refBlockNum: data.refBlockNum,
              permlink: data.permlink,
            },
            title: 'Fake post title',
          };
        }

        delete data._id;
        delete data.eventType;
        delete data.createdAt;
        delete data.updatedAt;
        delete data.fromUsers;
        delete data.permlink;
        delete data.refBlockNum;

        return data;
      },
    });
  }

  switch (type) {
    case AUTH_LOGOUT:
      return initialState;

    case CALL_MARK_AS_VIEWED_SUCCESS: {
      const updated = {};

      for (const id of meta.ids) {
        const notification = state[id];

        if (notification) {
          updated[id] = {
            ...notification,
            fresh: false,
          };
        }
      }

      return {
        ...state,
        ...updated,
      };
    }

    case CALL_MARK_ALL_AS_VIEWED_SUCCESS:
      return map(
        notification => ({
          ...notification,
          fresh: false,
        }),
        state
      );

    default:
      return state;
  }
}
