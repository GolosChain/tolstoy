import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, omit } from 'ramda';

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Unknown';
}

export async function getDynamicComponentInitialProps(DynamicComp, params) {
  let Comp = DynamicComp;

  if (Comp.preload) {
    Comp = (await Comp.preload()).default;
  }

  if (Comp.getInitialProps) {
    return Comp.getInitialProps(params);
  }

  return null;
}

export default (tabs, defaultTab) => Comp =>
  class WithTabs extends Component {
    static displayName = `withTabs(${getDisplayName(Comp)})`;

    static async getInitialProps({ query, store }) {
      const tab = tabs[query.section || defaultTab];

      const [profileProps, tabProps] = await Promise.all([
        Comp.getInitialProps({ query, store }),
        tab ? getDynamicComponentInitialProps(tab.Component, { query, store }) : null,
      ]);

      return {
        ...profileProps,
        tabProps: omit('namespacesRequired', tabProps),
        namespacesRequired: uniq(
          (profileProps.namespacesRequired || []).concat(
            (tabProps && tabProps.namespacesRequired) || []
          )
        ),
      };
    }

    static propTypes = {
      router: PropTypes.shape({
        query: PropTypes.shape({}).isRequired,
      }).isRequired,
    };

    render() {
      const { router } = this.props;

      const tab = tabs[router.query.section || defaultTab];

      return <Comp {...this.props} tabs={tabs} tab={tab} />;
    }
  };
