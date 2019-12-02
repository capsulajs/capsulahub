// prettier-ignore
module.exports = {
  columns: [
    { Header: 'Column A', accessor: 'columnA' },
    { Header: 'Column B', accessor: 'columnB' },
    { Header: 'Column C', accessor: 'columnC' }
  ],
  rows: new Array(20).fill(null).map((_, i) => ({
    columnA: `A${i}`,
    columnB: `B${i}`,
    columnC: `C${i}`,
  }))
}
