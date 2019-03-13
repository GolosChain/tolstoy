import React, { PureComponent } from 'react';
import WhatIsGolos from 'components/elements/about/WhatIsGolos/WhatIsGolos';
import LandingTeam from 'components/elements/about/LandingTeam/LandingTeam';
import LandingPartners from 'components/elements/about/LandingPartners/LandingPartners';

class Landing extends PureComponent {
  render() {
    return (
      <div className="Landing">
        <WhatIsGolos />
        <hr />
        <LandingTeam />
        <hr />
        <LandingPartners />
      </div>
    );
  }
}

export default {
  path: 'about',
  component: Landing,
};
