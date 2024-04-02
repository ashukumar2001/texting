export const getHostNameFromURL = (url) => {
  if (!url) return "";
  const urlObj = new URL(url);
  return urlObj.hostname;
};
