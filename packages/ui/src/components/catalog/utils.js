import flattenDeep from 'lodash/flattenDeep';

const simplify = (methods) => methods.map((method) => (method.children ? simplify(method.children) : method));

export const isMethodsContain = (methods, selectedMethod) => {
  if (!selectedMethod) {
    return false;
  }

  if (flattenDeep(simplify(methods)).find((method) => method.id === selectedMethod.id)) {
    return true;
  }

  return false;
};
