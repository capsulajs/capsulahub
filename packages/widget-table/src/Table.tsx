import { Observable } from 'rxjs';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
// @ts-ignore
import TableUI from '@capsulajs/capsulahub-ui/lib/Table';
import { helpers } from '@capsulajs/capsulahub-utils';
import { TableUIProps } from './api';

export class Table<Row> extends HTMLElement {
  public props$?: Observable<TableUIProps<Row>>;

  public connectedCallback() {
    const Component: React.JSXElementConstructor<any> = this.props$
      ? helpers.dataComponentHoc<TableUIProps<Row>>(TableUI, this.props$)
      : TableUI;
    ReactDOM.render(<Component />, this);
  }
}
