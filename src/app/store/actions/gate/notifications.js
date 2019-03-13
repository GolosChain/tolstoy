import { notificationSchema } from 'store/schemas/gate';
import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
  CALL_MARK_ALL_AS_VIEWED,
  CALL_MARK_ALL_AS_VIEWED_SUCCESS,
  CALL_MARK_ALL_AS_VIEWED_ERROR,
  CALL_MARK_AS_VIEWED,
  CALL_MARK_AS_VIEWED_SUCCESS,
  CALL_MARK_AS_VIEWED_ERROR,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';

// eslint-disable-next-line import/prefer-default-export
export const fetchNotifications = ({ fromId } = {}) => dispatch => {
  const params = {
    limit: 20,
    types: 'all',
    markAsViewed: false,
    fromId,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_NOTIFICATIONS, FETCH_NOTIFICATIONS_SUCCESS, FETCH_NOTIFICATIONS_ERROR],
      method: 'notify.getHistory',
      params,
      schema: { data: [notificationSchema] },
    },
    meta: params,
  });
};

export const markAllAsViewed = () => dispatch =>
  dispatch({
    [CALL_GATE]: {
      types: [
        CALL_MARK_ALL_AS_VIEWED,
        CALL_MARK_ALL_AS_VIEWED_SUCCESS,
        CALL_MARK_ALL_AS_VIEWED_ERROR,
      ],
      method: 'notify.markAllAsViewed',
      params: {},
    },
  });

export const markAsViewed = id => dispatch => {
  let ids;

  if (Array.isArray(id)) {
    ids = id;
  } else {
    ids = [id];
  }

  const params = {
    ids,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [CALL_MARK_AS_VIEWED, CALL_MARK_AS_VIEWED_SUCCESS, CALL_MARK_AS_VIEWED_ERROR],
      method: 'notify.markAsViewed',
      params,
    },
    meta: params,
  });
};
