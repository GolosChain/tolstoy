import { connect } from 'react-redux';

import { createDeepEqualSelector, dataSelector } from 'src/app/redux/selectors/common';

import HomeContainer from './HomeContainer';

export default connect(
    createDeepEqualSelector(
        [dataSelector('settings')],
        (settings) => {
            const selectedSelectTags = settings.getIn(['basic', 'selectedSelectTags']);
            const selectedFilterTags = settings.getIn(['basic', 'selectedFilterTags']);

            return {
                selectedSelectTags,
                selectedFilterTags,
            };
        }
    )
)(HomeContainer);
