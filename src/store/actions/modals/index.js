import DialogManager from 'components/elements/common/DialogManager';
import LoginForm from 'containers/login/LoginForm';

export function showLoginModal() {
  return new Promise(resolve => {
    DialogManager.showDialog({
      component: LoginForm,
      props: {},
      onClose: resolve,
    });
  });
}
