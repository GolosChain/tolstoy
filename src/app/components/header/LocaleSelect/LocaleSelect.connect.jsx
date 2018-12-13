import { connect } from 'react-redux';

import { currentUsernameSelector, getLocale } from 'src/app/redux/selectors/common';
import { setSettingsLocale } from 'src/app/redux/actions/settings';
import LocaleSelect from './LocaleSelect';

export default connect(
    state => ({
        currentUser: currentUsernameSelector(state),
        locale: getLocale(state),
    }),
    {
        setSettingsLocale,
    }
)(LocaleSelect);
