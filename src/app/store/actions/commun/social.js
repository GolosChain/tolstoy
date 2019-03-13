import { COMMUN_API } from 'store/middlewares/commun-api';
import {
  UPDATE_PROFILE_DATA,
  UPDATE_PROFILE_DATA_SUCCESS,
  UPDATE_PROFILE_DATA_ERROR,
  PIN_COMMUNITY,
  UNPIN_COMMUNITY,
  BLOCK_USER,
  UNBLOCK_USER,
} from 'store/constants/actionTypes';
import { currentUsernameSelector } from 'store/selectors/auth';
import { defaults } from 'utils/common';

const DEFAULT_META_VALUES = {
  type: null,
  about: null,
  app: null,
  email: null,
  phone: null,
  facebook: null,
  instagram: null,
  telegram: null,
  vk: null,
  website: null,
  first_name: null,
  last_name: null,
  name: null,
  birth_date: null,
  gender: null,
  location: null,
  city: null,
  occupation: null,
  i_can: null,
  looking_for: null,
  business_category: null,
  background_image: null,
  cover_image: null,
  profile_image: null,
  user_image: null,
  ico_address: null,
  target_date: null,
  target_plan: null,
  target_point_a: null,
  target_point_b: null,
};

export const updateProfileMeta = meta => async (dispatch, getState) => {
  const accountName = currentUsernameSelector(getState());

  if (!accountName) {
    throw new Error('Unauthorized');
  }

  // Warning about wrong fields (for development time only)
  if (process.env.NODE_ENV === 'development') {
    for (const fieldName of Object.keys(meta)) {
      if (DEFAULT_META_VALUES[fieldName] === undefined) {
        // eslint-disable-next-line no-console
        console.warn(
          `Field '${fieldName}' (value: ${meta[fieldName]}) not found in contract schema`
        );
      }
    }
  }

  const fullMeta = defaults(meta, DEFAULT_META_VALUES);

  const data = {
    account: accountName,
    meta: fullMeta,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [UPDATE_PROFILE_DATA, UPDATE_PROFILE_DATA_SUCCESS, UPDATE_PROFILE_DATA_ERROR],
      contract: 'social',
      method: 'updatemeta',
      params: data,
    },
    meta: data,
  });
};

export const pinActionFactory = (methodName, actionName) => communityId => async (
  dispatch,
  getState
) => {
  const accountName = currentUsernameSelector(getState());

  if (!accountName) {
    throw new Error('Unauthorized');
  }

  const data = {
    pinner: accountName,
    pinning: communityId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [actionName, `${actionName}_SUCCESS`, `${actionName}_ERROR`],
      contract: 'social',
      method: methodName,
      params: data,
    },
    meta: data,
  });
};

export const pin = pinActionFactory('pin', PIN_COMMUNITY);
export const unpin = pinActionFactory('unpin', UNPIN_COMMUNITY);

const createBlockAction = (methodName, actionName) => userId => async (dispatch, getState) => {
  const accountName = currentUsernameSelector(getState());

  if (!accountName) {
    throw new Error('Unauthorized');
  }

  const data = {
    blocker: accountName,
    blocking: userId,
  };

  return dispatch({
    [COMMUN_API]: {
      types: [actionName, `${actionName}_SUCCESS`, `${actionName}_ERROR`],
      contract: 'social',
      method: methodName,
      params: data,
    },
    meta: data,
  });
};

export const blockUser = createBlockAction('block', BLOCK_USER);
export const unblockUser = createBlockAction('unblock', UNBLOCK_USER);
