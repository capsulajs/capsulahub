import { BehaviorSubject, of } from 'rxjs';
import { Column } from '../api/index';
import { Row } from './types';
import Table from '../';

declare global {
  interface Window {
    tablePropsSubject?: BehaviorSubject<Row[]>;
  }
}

export const columns: Column[] = [
  {
    Header: 'Column A',
    accessor: 'columnA',
    filterable: true,
  },
  {
    Header: 'Column B',
    accessor: 'columnB',
  },
  {
    Header: 'Column C',
    accessor: 'columnC',
    Footer: () => 'Footer C',
  },
];

export const row = (i: number) => ({
  columnA: `A${i}`,
  columnB: `B${i}`,
  columnC: `C${i}`,
});

export const getProps$ = () => {
  // In tests env tablePropsSubject is set before loading the page
  if (!window.tablePropsSubject) {
    window.tablePropsSubject = new BehaviorSubject(new Array(25).fill(null).map((_, i) => row(i)));
  }

  return of({
    data$: window.tablePropsSubject.asObservable(),
    columns,
  });
};

export const mountWebComponentRequest = {
  WebComponent: Table,
  props$: getProps$(),
  name: 'web-table',
  mountId: 'web-table',
};
