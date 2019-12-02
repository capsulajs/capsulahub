ace.define('ace/theme/capsula-js', ['require', 'exports', 'module', 'ace/lib/dom'], function(
  acequire,
  exports,
  module
) {
  exports.isDark = true;
  exports.cssClass = 'ace-capsula-js';
  exports.cssText =
    '\
  \
.ace-capsula-js .ace_gutter {\
  background: #212121;\
  color: #767676\
}\
.ace-capsula-js .ace_print-margin {\
  width: 1px;\
  background: #212121\
}\
.ace-capsula-js {\
  background: #212121;\
  color: #DEDEDE;\
}\
.ace-capsula-js .ace_selection {\
  background: #58D7FE;\
}\
.ace-capsula-js .ace_constant,\
.ace-capsula-js .ace_constant.ace_character,\
.ace-capsula-js .ace_constant.ace_character.ace_escape,\
.ace-capsula-jss .ace_constant.ace_other {\
  color: #DEDEDE\
}\
.ace-capsula-js .ace_constant.ace_language {\
  color: #DEDEDE\
}\
.ace-capsula-js .ace_string {\
  color: #DEDEDE\
}\
.ace-capsula-js .ace_variable {\
  color: #57D7FF\
}\
.ace-capsula-js .ace_variable.ace_language {\
  color: #DEDEDE\
}';
  const dom = acequire('../lib/dom');
  dom.importCssString(exports.cssText, exports.cssClass);
});
