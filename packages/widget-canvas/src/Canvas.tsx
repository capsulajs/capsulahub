import { Observable } from 'rxjs';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
// @ts-ignore
import CanvasUI from '@capsulajs/capsulahub-ui/lib/Canvas';
import { helpers } from '@capsulajs/capsulahub-utils';
import { CanvasUIProps } from './api';

const mountPoint = 'web-canvas';

export class Canvas extends HTMLElement {
  public props$?: Observable<CanvasUIProps>;

  public connectedCallback() {
    const Component: React.JSXElementConstructor<any> = this.props$
      ? helpers.dataComponentHoc<CanvasUIProps>(CanvasUI, this.props$)
      : CanvasUI;
    ReactDOM.render(<Component />, document.getElementById(mountPoint));
  }
}
