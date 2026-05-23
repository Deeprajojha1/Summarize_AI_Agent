export const truncateText = (text: string, max = 120) => text.length > max ? `${text.slice(0, max)}...` : text;
