import { connect } from 'react-redux';

//import { currentUsernameSelector, getLocale } from 'app/redux/selectors/common';
//import { setSettingsLocale } from 'app/redux/actions/settings';
import LocaleSelect from './LocaleSelect';

export default connect(
  state => ({
    // TODO
    // currentUser: currentUsernameSelector(state),
    // locale: getLocale(state),
    locale: 'ru',
  }),
  {
    //setSettingsLocale,
    setSettingsLocale: () => {},
  }
)(LocaleSelect);
