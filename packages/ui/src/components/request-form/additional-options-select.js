import React, { PureComponent } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import './styles.css';

const styles = () => {
  return createStyles({
    wrapper: {
      marginRight: '16px',
    },
  });
};

class AdditionalOptionsSelect extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  onChange = (data) => this.props.onChange(data.target.value);

  render() {
    const { classes, options, value, label } = this.props;
    return (
      <FormControl className={classes.wrapper} margin="dense">
        <InputLabel>{label}</InputLabel>
        <Select className={classes.select} value={value} onChange={this.onChange}>
          {options.map(({ id, label }) => (
            <MenuItem dense={true} key={id} value={id}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles)(AdditionalOptionsSelect);
