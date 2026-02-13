export const formatDateTime = (dateString: string) => {
  const dateObj = new Date(dateString);
  let formatted = dateObj.toLocaleString('sv-SE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
  return formatted.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
};