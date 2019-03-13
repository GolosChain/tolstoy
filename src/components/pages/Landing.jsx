import React, { PureComponent } from 'react';
import WhatIsGolos from 'src/components/elements/about/WhatIsGolos/WhatIsGolos';
import LandingTeam from 'src/components/elements/about/LandingTeam/LandingTeam';
import LandingPartners from 'src/components/elements/about/LandingPartners/LandingPartners';

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
