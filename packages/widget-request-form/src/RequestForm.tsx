import { Observable } from 'rxjs';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
// @ts-ignore
import { RequestForm as RequestFormUI } from '@capsulajs/capsulahub-ui';
import { helpers } from '@capsulajs/capsulahub-utils';
import { RequestFormUIProps } from './api';

const mountPoint = 'web-request-form';

export class RequestForm extends HTMLElement {
  public props$?: Observable<RequestFormUIProps>;

  public connectedCallback() {
    const Component: React.JSXElementConstructor<any> = this.props$
      ? helpers.dataComponentHoc<RequestFormUIProps>(RequestFormUI, this.props$)
      : RequestFormUI;
    ReactDOM.render(<Component />, document.getElementById(mountPoint));
  }
}
