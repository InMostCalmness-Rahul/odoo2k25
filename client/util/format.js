// format.js
export const formatDateTime = (isoString) => {
  const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(isoString).toLocaleString("en-US", options);
};

export const truncateText = (text, maxLength = 100) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
