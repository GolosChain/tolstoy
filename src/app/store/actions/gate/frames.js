import { FETCH_EMBED, FETCH_EMBED_SUCCESS, FETCH_EMBED_ERROR } from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';

// eslint-disable-next-line import/prefer-default-export
export const getEmbed = ({ type = 'oembed', url = '' }) => {
  const params = { type, url };
  return {
    [CALL_GATE]: {
      types: [FETCH_EMBED, FETCH_EMBED_SUCCESS, FETCH_EMBED_ERROR],
      method: 'frame.getEmbed',
      params,
    },
    meta: params,
  };
};
