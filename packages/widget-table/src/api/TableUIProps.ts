import { Observable } from 'rxjs';
import { Column, Height } from './index';

export default interface TableUIProps<Row> {
  /* Observable that emits table rows */
  data$: Observable<Row[]>;
  /* Columns of the table */
  columns: Column[];
  /* Count of rows per page (default 10) */
  defaultPageSize?: number;
  /* Table body height (default 450) */
  height?: Height;
  /* Possibility to filter by each column in the table (default false) */
  filterable?: boolean;
  /* Possibility to sort by each column in the table (default false) */
  sortable?: boolean;
  /* Possibility to change no data message */
  noDataText?: string;
}
