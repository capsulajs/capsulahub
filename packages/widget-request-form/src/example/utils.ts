import { BehaviorSubject } from 'rxjs';
import { JavascriptLanguage } from '../api/Language';
import { RequestFormUIProps, SubmittedData } from '../api';
import RequestForm from '../';

declare global {
  interface Window {
    requestFormPropsSubject: BehaviorSubject<RequestFormUIProps>;
  }
}

export const basicProps: RequestFormUIProps = {
  selectedMethodPath: 'SelectedService/SelectedMethod',
  content: {
    language: 'javascript' as JavascriptLanguage,
    requestArgs: 'return {};',
  },
  onSubmit: (data: SubmittedData) => {
    // tslint:disable-next-line
    console.log('the data from RequestForm has been submitted', data);
  },
};

export const getProps$ = () => {
  // In tests env requestFormPropsSubject is set before loading the page
  if (!window.requestFormPropsSubject) {
    window.requestFormPropsSubject = new BehaviorSubject(basicProps);
  }
  return window.requestFormPropsSubject!.asObservable();
};

export const mountWebComponentRequest = {
  WebComponent: RequestForm,
  props$: getProps$(),
  name: 'web-request-form',
  mountId: 'web-request-form',
};
