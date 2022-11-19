export const prompt: (path: string, username: string) => string = (
  path: string,
  username: string
): string => {
  return `phew@${username}:${path}$`;
};
