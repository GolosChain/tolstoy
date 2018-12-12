import { connect } from 'react-redux';

import { getLocale } from 'src/app/redux/selectors/common';
import LocaleSelect from './LocaleSelect';

export default connect(
    state => ({
        locale: getLocale(state),
    }),
    null
)(LocaleSelect);
