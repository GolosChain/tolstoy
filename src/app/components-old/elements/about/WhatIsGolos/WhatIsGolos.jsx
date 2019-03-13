import React, { PureComponent } from 'react';
import tt from 'counterpart';

export default class WhatIsGolos extends PureComponent {
  render() {
    return (
      <section className="WhatIsGolos text-center" id="what-is-golos">
        <div className="row">
          <div className="small-12 medium-12 large-centered columns columns WhatIsGolos__video">
            <h1>{tt('about_page.header')}</h1>
            <div>
              <iframe
                width="853"
                height="480"
                src="https://www.youtube.com/embed/8a0TPACOu2k"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <div className="row WhatIsGolos__action">
          <div className="small-12 columns">
            <p>
              {tt('about_page.decription_1')}
              <br />
              {tt('about_page.decription_2')}
            </p>
          </div>
        </div>
      </section>
    );
  }
}
