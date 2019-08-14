import { Observable } from 'rxjs';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
// @ts-ignore
import ModalUI from '@capsulajs/capsulahub-ui/lib/Modal';
import { helpers } from '@capsulajs/capsulahub-utils';
import { ModalUIProps } from './api';

export class Modal extends HTMLElement {
  public props$?: Observable<ModalUIProps>;

  public connectedCallback() {
    const Component: React.JSXElementConstructor<any> = this.props$
      ? helpers.dataComponentHoc<ModalUIProps>(ModalUI, this.props$)
      : ModalUI;
    ReactDOM.render(<Component />, this);
  }
}
