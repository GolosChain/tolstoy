import React, { PureComponent } from 'react';
import WhatIsGolos from 'src/app/components-old/elements/about/WhatIsGolos/WhatIsGolos';
import LandingTeam from 'src/app/components-old/elements/about/LandingTeam/LandingTeam';
import LandingPartners from 'src/app/components-old/elements/about/LandingPartners/LandingPartners';

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
