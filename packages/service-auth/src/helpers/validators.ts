export const isNonEmptyString = (value: any) => typeof value === 'string' && !!value.trim().length;

export const isObject = (value: any) => typeof value === 'object' && !!value && typeof value.map !== 'function';
