export const formatDateTime = (dateString: string | undefined): string => {
  if (typeof dateString == "undefined") return "";
  const dateObj = new Date(dateString);
  let formatted = dateObj.toLocaleString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
  return formatted.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
};

export const formatDay = (dateString: string | undefined): string => {
  if (typeof dateString == "undefined") return "";
  let formatted = (new Date(dateString)).toLocaleString("sv-SE", {
    weekday: "long"
  });
  return formatted.substring(0, 1).toUpperCase() + formatted.substring(1);
};

export const formatDateIso = (dateString: string | undefined): string => {
  if (typeof dateString == "undefined") return "";
  return dateString.substring(0, 10);
};

export const formatHourMin = (dateString: string | undefined): string => {
  if (typeof dateString == "undefined") return "";
  return dateString.substring(11, 16);
};

export const formatDayMonth = (dateString: string | undefined): string => {
  if (typeof dateString == "undefined") return "";
  let formatted = (new Date(dateString)).toLocaleString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return formatted.substring(0, 1).toUpperCase() + formatted.substring(1);
};