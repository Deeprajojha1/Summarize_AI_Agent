export const compactText = (value = '', max = 240) => value.length > max ? `${value.slice(0, max)}...` : value;
