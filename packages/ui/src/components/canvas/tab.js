import React from 'react';
import PropTypes from 'prop-types';
import { keyboard } from './settings';

export default class Tab extends React.PureComponent {
  static propTypes = {
    tab: PropTypes.object.isRequired,
    isActive: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  state = {
    value: this.props.tab.name,
    isHover: false,
    isEdit: false,
  };

  onSelect = () => this.props.onSelect(this.props.tab.id);
  onChange = (e) => this.setState({ value: e.target.value.trim() });
  onKeyDown = (e) => (e.which === keyboard.escapeKey || e.which === keyboard.enterKey) && this.onSave();
  onRemove = (e) => e.preventDefault() || this.props.onRemove(this.props.tab.id);
  onSave = () => {
    const { value } = this.state;
    if (value && value.length > 2) {
      this.props.onUpdate({ tabId: this.props.tab.id, name: value });
      this.setState({ isEdit: false });
    }
  };
  onMouseEnter = () => this.setState({ isHover: true });
  onMouseLeave = () => this.setState({ isHover: false });
  onDoubleClick = () => this.setState({ isEdit: true });

  renderContent() {
    const { isHover, isEdit, value } = this.state;
    const { tab, isActive } = this.props;

    if (isEdit) {
      return (
        <input
          data-cy="canvas-tab-input"
          className="canvas-tab-input"
          value={value}
          onChange={this.onChange}
          onBlur={this.onSave}
          onKeyDown={this.onKeyDown}
        />
      );
    }

    return (
      <div
        data-cy={isActive ? 'canvas-tab-title-active' : 'canvas-tab-title'}
        className="canvas-tab-title"
        // isActive={isActive}
        onClick={this.onSelect}
        onDoubleClick={this.onDoubleClick}
      >
        {tab.name}
      </div>
    );
  }

  render() {
    const { isHover, isEdit } = this.state;
    const { isActive, tab } = this.props;

    return (
      <div
        data-cy={`canvas-tab-${tab.id}`}
        className="canvas-tab"
        // isActive={isActive}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {this.renderContent()}
        {!isEdit && (
          <span
            className="canvas-tab-close"
            data-cy="canvas-tab-remove"
            // isHover={isHover}
            onClick={this.onRemove}
          >
            &#10005;
          </span>
        )}
      </div>
    );
  }
}
