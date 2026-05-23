export const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString() : 'No date';
