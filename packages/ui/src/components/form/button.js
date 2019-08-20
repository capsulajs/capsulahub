import React from 'react';
import styled from 'styled-components';
import { defaultFontFamily, defaultFontSize } from '../constants';

const Button = styled.button`
  font-family: ${defaultFontFamily};
  font-size: ${defaultFontSize};
  background: ${(props) => props.theme.bg};
  font-family: ${(props) => props.theme.fontFamily};
  color: ${(props) => props.theme.color};
  padding: 3px 5px 5px 5px;
  padding: ${(props) => props.theme.padding};
  margin: 0;
  cursor: ${(props) => props.theme.cursor};
  border: none;
  transition: box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    box-shadow: ${(props) => props.theme.shadow};
  }
  ${(props) => props.css};
`;

const gradient = 'linear-gradient(45deg, rgb(61,98,172) 0%, rgb(54,159,218) 74%, rgb(68,188,197) 100%)';
const boxShadow = {
  active: '0px 0px 10px 0px rgba(238, 238, 238, 0.5);',
  disabled: 'none',
  clicked: 'none',
};

const themes = {
  active: { bg: gradient, color: '#fff', cursor: 'pointer', shadow: boxShadow.active },
  disabled: { bg: '#737373', color: '#999999', cursor: 'not-allowed', shadow: boxShadow.disabled },
  clicked: { bg: '#fff', color: '#57D7FF', shadow: boxShadow.clicked },
};

export default ({ id, text, theme, onClick, css, dataCy = 'button' }) => {
  return (
    <Button data-cy={dataCy} id={id} theme={themes[theme] || themes['active']} onClick={onClick} css={css}>
      {text}
    </Button>
  );
};
