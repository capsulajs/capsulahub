import { createMuiTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const textColor = '#d0d0d0';
const primaryColor = '#3d62ac';
const primaryColorLight = '#369fda';
const fontSize = 12;

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: primaryColorLight,
      main: primaryColor,
    },
    background: {
      default: grey['800'],
      paper: grey['900'],
    },
    text: {
      primary: textColor,
    },
  },
  typography: {
    fontSize,
    body1: {
      fontSize: '11px',
    },
  },
  overrides: {
    MuiListItem: {
      root: {
        borderTopColor: grey['700'],
        '&$selected': {
          color: '#e6e6e6',
          backgroundColor: '#303030',
        },
      },
    },
    MuiSelect: {
      icon: {
        color: textColor,
      },
    },
    MuiMenuItem: {
      root: {
        fontSize,
        minHeight: '24px',
        lineHeight: 1,
      },
    },
    MuiInput: {
      underline: {
        '&::after': {
          borderBottomColor: primaryColor,
        },
      },
    },
  },
});

export const darkGrey = () => grey['900'];

export const lightGreyBorder = () => `1px solid ${grey['700']}`;

export const connectionStatusYellow = '#F4B400';
export const connectedGreen = '#11FF0C';
export const disconnectedRed = '#FF5050';
