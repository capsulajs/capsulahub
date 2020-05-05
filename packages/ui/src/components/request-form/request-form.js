import React, { PureComponent } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Tooltip, IconButton } from '@material-ui/core';
import { Cached } from '@material-ui/icons';
import styled from 'styled-components';
import Editor from './editor';
import Dropdown from '../form/dropdown';
import Input from '../form/input';
import Button from '../form/button';
import AdditionalOptionsSelect from './additional-options-select';
import {
  defaultFontStyle,
  defaultFontWeight,
  defaultFontSize,
  defaultFontFamily,
  defaultColor,
  defaultRequestFormBgColor,
  codeModes,
  namespace,
} from '../constants';
import './styles.css';
import { darkTheme } from './theme-material-ui';

const Container = styled.div`
  font-style: ${(props) => props.theme.fontStyle};
  font-weight: ${(props) => props.theme.fontWeight};
  font-size: ${(props) => props.theme.fontSize};
  font-family: ${(props) => props.theme.fontFamily};
  color: ${(props) => props.theme.color};
  background-color: ${(props) => props.theme.bgColor};
  width: 100%;
  height: 100%;
  min-width: 150px;
  min-height: 100px;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 0 10px 27px;
`;
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin: 5px 0 15px 0;
  height: 55px;
`;
const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const Title = styled.div`
  font-size: 13px;
  text-transform: uppercase;
  color: ${(props) => props.color};
`;
const ArgumentsCount = styled.div`
  display: flex;
  align-items: center;
`;
const ArgumentsCountLabel = styled.label`
  margin-right: 10px;
`;
const IconWrapper = styled.div`
  ${(props) => props.iconStyle}
`;
const defaultArgVal = {
  javascript: 'return {};',
  json: '{}',
};

const defaultHeight = 561;

const languages = [{ label: codeModes.javascript }, { label: codeModes.json }];

const setContent = ({ content, msgId, cache }) => {
  const { requestArgs } = content;
  let args = typeof requestArgs === 'string' ? [requestArgs] : requestArgs;
  let iconClass = 'transparentIcon';
  if (cache) {
    const val = localStorage.getItem(`${namespace}-${msgId}`);
    if (!!val) {
      args = JSON.parse(val);
      iconClass = '';
    }
  }
  return {
    requestArgs: args,
    argsCount: args.length,
    iconClass,
  };
};

export default class RequestForm extends PureComponent {
  static propTypes = {
    selectedMethodPath: PropTypes.string,
    content: PropTypes.shape({
      language: PropTypes.string.isRequired,
      requestArgs: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
      timestamp: PropTypes.number.isRequired,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onContentChange: PropTypes.func,
    theme: PropTypes.object,
    isChangeLanguageVisible: PropTypes.bool,
    isChangeArgsCountVisible: PropTypes.bool,
    isSelectedMethodPathVisible: PropTypes.bool,
    isLineNumberVisible: PropTypes.bool,
    title: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    additionalOptions: PropTypes.shape({
      label: PropTypes.string.isRequired,
      fieldName: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
    }),
    msgId: PropTypes.string.isRequired,
    cache: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    theme: {
      fontStyle: defaultFontStyle,
      fontWeight: defaultFontWeight,
      fontSize: defaultFontSize,
      fontFamily: defaultFontFamily,
      bgColor: defaultRequestFormBgColor,
      color: defaultColor,
    },
    selectedMethodPath: '',
    isChangeLanguageVisible: true,
    isChangeArgsCountVisible: true,
    isSelectedMethodPathVisible: true,
    isLineNumberVisible: true,
    title: 'Request Form',
    width: '100%',
    height: '100%',
    msgId: 'defaultId',
    cache: true,
  };

  state = {
    language: this.props.content.language,
    ...setContent(this.props),
    editorsIsValid: [true],
    executionError: '',
    additionalOptionValue: this.getAdditionalOptionValueFromOptions(this.props.additionalOptions),
    // When a new content has been pasted, Editor does not recalculate the width in order to show the correct scrollbar
    // So that we want to generate unique ID each time when "paste" event happens and use it as a key
    // It will trigger the component to remount completely and recalculate the scrollbar
    lastPastedContentTimestamp: `${Date.now()}`,
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.content !== prevProps.content) {
      if (
        this.props.content.language !== prevProps.content.language ||
        this.props.content.requestArgs !== prevProps.content.requestArgs ||
        this.props.content.timestamp !== prevProps.content.timestamp
      ) {
        const { language, requestArgs } = this.props.content;
        if (typeof requestArgs === 'string') {
          this.setState((prevState) => ({
            language,
            requestArgs: prevState.requestArgs.map(() => requestArgs),
            argsCount: prevState.argsCount,
            executionError: '',
          }));
        } else {
          this.setState({
            language,
            requestArgs,
            argsCount: requestArgs.length,
            executionError: '',
          });
        }
      }
    }
    if (this.state.argsCount < prevState.argsCount && this.state.argsCount) {
      this.setState({
        editorsIsValid: prevState.editorsIsValid.slice(0, this.state.argsCount),
      });
    }
    if (this.props.additionalOptions !== prevProps.additionalOptions) {
      this.setState({
        additionalOptionValue: this.getAdditionalOptionValueFromOptions(this.props.additionalOptions),
      });
    }
  }

  getAdditionalOptionValueFromOptions(additionalOptions) {
    return additionalOptions ? additionalOptions.initialValue || additionalOptions.options[0].id : undefined;
  }

  onChangeLanguage = ({ label: newLanguage }) => {
    if (newLanguage !== this.state.language) {
      this.setState((prevState) => ({
        language: newLanguage,
        requestArgs: prevState.requestArgs.map(() => defaultArgVal[newLanguage]),
        executionError: '',
      }));
    }
  };

  onChangeArgumentsCount = (argsCount) => {
    const argsCountNumber = Number(argsCount);
    if (argsCountNumber > 0) {
      this.setState((prevState) => ({
        argsCount: argsCountNumber,
        requestArgs: [
          ...prevState.requestArgs,
          ...new Array(argsCountNumber).fill(defaultArgVal[prevState.language]),
        ].slice(0, argsCountNumber),
        executionError: '',
      }));
    } else {
      this.setState({
        argsCount: '',
      });
    }
  };

  onChangeArgument = (index, newArgument) => {
    const { msgId, cache } = this.props;
    this.setState(
      (prevState) => {
        const newArgs = [...prevState.requestArgs];
        newArgs[index] = newArgument;
        let iconClass = 'transparentIcon';
        if (cache) {
          localStorage.setItem(`${namespace}-${msgId}`, JSON.stringify(newArgs));
          iconClass = '';
        }
        return { requestArgs: newArgs, executionError: '', iconClass };
      },
      () => {
        const triggerRemountAfterPasting = () => {
          this.contentHasBeenPasted = false;
          // We need to simulate some delay after "paste" event occurs to give Editor some time to complete its
          // inner formatting logic
          setTimeout(() => {
            this.setState({ lastPastedContentTimestamp: `${Date.now()}` });
          }, 0);
        };
        this.contentHasBeenPasted && triggerRemountAfterPasting();
      }
    );
  };

  onPaste = () => {
    this.contentHasBeenPasted = true;
  };

  onValid = ({ isValid, index }) =>
    isValid !== this.state.editorsIsValid[index] &&
    this.setState((prevState) => {
      const newEditorsIsValid = [...prevState.editorsIsValid];
      newEditorsIsValid[index] = isValid;
      return {
        editorsIsValid: newEditorsIsValid,
      };
    });

  onAdditionalValueChange = (additionalOptionValue) => {
    this.setState({ additionalOptionValue });
  };

  onSubmit = () => {
    if (this.isFormValid()) {
      const { language, requestArgs: args, additionalOptionValue } = this.state;
      const { onSubmit, additionalOptions } = this.props;
      try {
        const requestArgs = args.map((arg) =>
          language === codeModes.javascript ? eval(`(function(){${arg}})()`) : JSON.parse(arg)
        );
        const submittedData = { language, requestArgs };
        if (additionalOptions) {
          submittedData.additionalOption = { fieldName: additionalOptions.fieldName, value: additionalOptionValue };
        }
        onSubmit(submittedData);
      } catch (error) {
        this.setState({ executionError: `${error.name}: ${error.message}` });
      }
    }
  };

  onClearCache = () => {
    const { msgId, content, cache } = this.props;
    localStorage.removeItem(`${namespace}-${msgId}`);
    this.setState({
      ...setContent({ content, msgId, cache }),
    });
  };
  isFormValid = () =>
    !!this.props.selectedMethodPath &&
    this.state.requestArgs.every((content) => !!content.trim()) &&
    !this.state.executionError &&
    typeof this.state.editorsIsValid.find((isValid) => !isValid) === 'undefined';

  render() {
    const { language, requestArgs, argsCount, additionalOptionValue } = this.state;
    const {
      theme,
      isChangeLanguageVisible,
      isChangeArgsCountVisible,
      title,
      selectedMethodPath,
      isSelectedMethodPathVisible,
      width,
      isLineNumberVisible,
      additionalOptions,
    } = this.props;

    return (
      <ThemeProvider theme={darkTheme}>
        <Container key={this.state.lastPastedContentTimestamp} theme={theme} data-cy="request-form-container">
          <Column>
            <Header data-cy="request-form-header">
              <Wrapper>
                <Title data-cy="request-form-title">{title}</Title>
              </Wrapper>
              <Wrapper>
                {isChangeArgsCountVisible && (
                  <ArgumentsCount data-cy="request-form-args-count">
                    <ArgumentsCountLabel data-cy="request-form-args-count-label">Arguments:</ArgumentsCountLabel>
                    <Input
                      data-cy="request-form-args-count-value"
                      min="1"
                      onChange={this.onChangeArgumentsCount}
                      value={argsCount}
                      type="number"
                      width="30px"
                    />
                  </ArgumentsCount>
                )}
                {isChangeLanguageVisible && (
                  <Dropdown
                    dataCy="request-form-language-dropdown"
                    selected={this.state.language}
                    title="Choose the language"
                    items={languages}
                    width={120}
                    onChange={this.onChangeLanguage}
                  />
                )}
              </Wrapper>
              <IconWrapper>
                <Tooltip title="Clear cache">
                  <IconButton
                    aria-label="Clear"
                    size="small"
                    onClick={this.onClearCache}
                    data-cy="request-form-btn-clear-cache"
                    className={this.state.iconClass}
                  >
                    <Cached fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </IconWrapper>
            </Header>
            {requestArgs.map((value, index) => {
              let height = this.props.height;
              if (isChangeArgsCountVisible) {
                height = `${(defaultHeight - (65 + 2 * requestArgs.length)) / requestArgs.length}px`;
              }
              return (
                <Editor
                  key={index}
                  index={index}
                  mode={language}
                  value={value}
                  onChange={this.onChangeArgument}
                  onPaste={this.onPaste}
                  onValid={this.onValid}
                  height={height}
                  width={width}
                  isLineVisible={index + 1 !== argsCount}
                  isLineNumberVisible={isLineNumberVisible}
                />
              );
            })}
            <Footer>
              {additionalOptions && additionalOptionValue && (
                <AdditionalOptionsSelect
                  label={additionalOptions.label}
                  value={additionalOptionValue}
                  options={additionalOptions.options}
                  onChange={this.onAdditionalValueChange}
                />
              )}
              <Button
                dataCy={`request-form-submit-btn-${this.isFormValid() ? 'active' : 'disabled'}`}
                text="Send"
                theme={this.isFormValid() ? 'active' : 'disabled'}
                css="padding: 5px 45px; margin-right: 16px; font-size: 13px;"
                onClick={this.onSubmit}
              />
              {this.state.executionError && (
                <ErrorMessage data-cy="request-form-error-message">{this.state.executionError}</ErrorMessage>
              )}
              {isSelectedMethodPathVisible && (
                <Title data-cy="request-form-selected-method-path" color="#f8f7f7">
                  {selectedMethodPath}
                </Title>
              )}
            </Footer>
          </Column>
        </Container>
      </ThemeProvider>
    );
  }
}
