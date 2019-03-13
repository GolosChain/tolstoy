import { CONTACTS_SEARCH } from 'src/messenger/redux/constants/contacts';

export const searchContacts = query => ({
  type: CONTACTS_SEARCH,
  payload: { query },
});
