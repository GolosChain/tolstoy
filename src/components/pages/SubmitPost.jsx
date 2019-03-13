import React from 'react';
import { browserHistory } from 'mocks/react-router';
import PostFormLoader from 'src/components/modules/PostForm/loader';

class SubmitPost extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    document.body.classList.add('submit-page');
  }

  componentWillUnmount() {
    document.body.classList.remove('submit-page');
  }

  render() {
    return <PostFormLoader onSuccess={this._onSuccess} />;
  }

  _onSuccess = () => {
    browserHistory.push('/created');
  };
}

export default {
  path: 'submit',
  component: SubmitPost,
};
