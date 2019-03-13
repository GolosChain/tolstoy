import { MESSENGER_INIT } from 'src/messenger/redux/constants/messenger';

export function initMessenger(owner) {
  return {
    type: MESSENGER_INIT,
    payload: { owner },
  };
}
