export const host = (fullUrl: string) => {
  const url = new URL(fullUrl);
  return url.host;
};
