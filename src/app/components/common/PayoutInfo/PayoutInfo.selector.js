import { createSelector } from 'reselect';
import { getVestsToGolosRatio } from 'src/app/redux/selectors/common';

export default createSelector(
    [(state, props) => props.data, getVestsToGolosRatio],
    (data, vestsToGolosRatio) => {
        const isPending = parseFloat(data.get('total_payout_value')) === 0;

        const [author, curator, benefactor] = ['author', 'curator', 'benefactor'].map(type => {
            let value;

            if (isPending) {
                value = data.get(`pending_${type}_payout_gests_value`);
            } else {
                if (type === 'benefactor') {
                    type = 'beneficiary';
                }

                value = data.get(`${type}_gests_payout_value`);
            }

            if (!value) {
                return 0;
            }

            return parseFloat(value) * vestsToGolosRatio;
        });

        return {
            isPending,
            author,
            curator,
            benefactor,
        };
    }
);
