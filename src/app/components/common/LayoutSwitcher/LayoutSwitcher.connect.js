import { connect } from 'react-redux';

import { changeProfileLayout } from 'src/app/redux/actions/ui';
import LayoutSwitcher from './LayoutSwitcher';

export default connect(
    state => ({
        layout: (state.ui.profile && state.ui.profile.get('layout')) || 'list',
    }),
    {
        changeProfileLayout,
    }
)(LayoutSwitcher);
