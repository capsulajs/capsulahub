import { ModalUIProps } from '../api/index';
import { BehaviorSubject } from 'rxjs';
import Modal from '../';

declare global {
  interface Window {
    modalPropsSubject?: BehaviorSubject<ModalUIProps>;
  }
}

export const basicProps: ModalUIProps = {
  title: 'Example of title',
  children: 'Example of content',
};

export const getProps$ = () => {
  // In tests env requestFormPropsSubject is set before loading the page
  if (!window.modalPropsSubject) {
    window.modalPropsSubject = new BehaviorSubject(basicProps);
  }
  return window.modalPropsSubject.asObservable();
};

export const mountWebComponentRequest = {
  WebComponent: Modal,
  props$: getProps$(),
  name: 'web-modal',
  mountId: 'web-modal',
};
