import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/mode/json';
import './theme';

const Line = styled.div`
  height: 1px;
  border-bottom: 1px dashed #767676;
  width: 100%;
`;

const EditorWrapper = styled.div`
  flex-grow: 1;
`;

export default class Editor extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    height: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onValid: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  editor = undefined;

  componentDidUpdate(prevProps) {
    if (prevProps.mode !== this.props.mode) {
      this.editor.getSession().setMode(`ace/mode/${this.props.mode}`);
    }
  }

  onChange = (input) => this.props.onChange(this.props.index, input);

  onValid = (errors) => {
    const { onValid, index } = this.props;
    let isValid = false;
    if (errors.filter((error) => error.type !== 'info').length === 0) {
      isValid = true;
    }
    onValid({ isValid, index });
  };

  onLoad = (editor) => (this.editor = editor);

  render() {
    const { height, width, mode, value, index, isLineVisible, isLineNumberVisible } = this.props;
    return (
      <EditorWrapper data-cy={`request-form-editor-${index}`}>
        <AceEditor
          mode={mode}
          theme="capsula-js"
          value={value}
          onLoad={this.onLoad}
          onChange={this.onChange}
          onPaste={this.props.onPaste}
          onValidate={this.onValid}
          fontSize={12}
          setOptions={{
            showLineNumbers: isLineNumberVisible,
            tabSize: 2,
          }}
          editorProps={{ $blockScrolling: true }}
          height={height}
          width={width}
          className="request-form-editor"
        />
        {isLineVisible && <Line />}
      </EditorWrapper>
    );
  }
}
