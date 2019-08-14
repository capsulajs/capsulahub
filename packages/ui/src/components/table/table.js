import 'react-table/react-table.css';
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { of } from 'rxjs';
import { defaultFontStyle, defaultFontSize, defaultFontFamily, defaultBackgroundColor } from '../constants';

export default class Table extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    defaultPageSize: PropTypes.number.isRequired,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    sortable: PropTypes.bool.isRequired,
    filterable: PropTypes.bool.isRequired,
    noDataText: PropTypes.string,
  };

  static defaultProps = {
    data: of([]),
    columns: [],
    defaultPageSize: 10,
    height: '100%',
    sortable: false,
    filterable: false,
    noDataText: 'No rows found',
  };

  state = {
    rows: [],
  };

  defaultFilterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id;

    switch (typeof row[id]) {
      case 'undefined':
        return true;
      case 'number':
        return new RegExp(filter.value).test(String(row[id]));
      default:
        return new RegExp(filter.value, 'gi').test(row[id]);
    }
  };

  onRows = (rows) => this.setState({ rows });

  componentDidMount() {
    this.sub = this.props.data$ && this.props.data$.subscribe(this.onRows);
  }

  render() {
    const { rows } = this.state;
    const { columns, defaultPageSize, height, sortable, filterable, noDataText } = this.props;
    const styles = {
      height,
      fontFamily: defaultFontFamily,
      fontStyle: defaultFontStyle,
      fontSize: defaultFontSize,
      background: defaultBackgroundColor,
      color: '#d3d3d3',
      width: '100%',
      minWidth: 300,
      minHeight: 200,
    };

    return (
      <ReactTable
        data={rows}
        columns={columns}
        defaultFilterMethod={this.defaultFilterMethod}
        defaultPageSize={defaultPageSize}
        sortable={sortable}
        filterable={filterable}
        noDataText={noDataText}
        style={styles}
        className="-striped -highlight"
      />
    );
  }

  componentWillUnmount() {
    this.sub && this.sub.unsubscribe();
  }
}
