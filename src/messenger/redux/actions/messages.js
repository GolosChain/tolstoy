import { MESSAGES_GET_THREAD } from 'src/messenger/redux/constants/messages';

export const getThread = contact => ({
  type: MESSAGES_GET_THREAD,
  payload: contact,
});
