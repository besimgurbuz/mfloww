export function parseCookie(cookieStr?: string): Record<string, string> {
  return (
    cookieStr?.split(';').reduce((cookieSet, rawCookieItem) => {
      const match = rawCookieItem.match(/(.*?)=(.*)$/);
      if (match) {
        const [_, key, value] = match;
        cookieSet[key.trim()] = value.trim();
      }
      return cookieSet;
    }, {} as Record<string, string>) || {}
  );
}
